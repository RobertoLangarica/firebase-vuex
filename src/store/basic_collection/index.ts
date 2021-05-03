import { MutationTree, GetterTree, ActionTree, Commit } from 'vuex'
import { IGlobalState } from '../store'
import firebase from '@/firebase'
import firebaseApp from 'firebase/app'
import { useStore } from '../'
import { computed } from 'vue'


export interface ICollectionItem{
    id: string;
    [key: string]: any;
}
export interface IBasicCollection{
    list: ICollectionItem[];
    unsubscribe: (() => void) | null;
}

const state = (): IBasicCollection=>({
    list:[],
    unsubscribe:null
})

const mutations = (): MutationTree<IBasicCollection>=>({
    replace(state, value: ICollectionItem){
        const index = state.list.findIndex(s=>s.id === value.id)
        if(index >= 0){
            // replace
            state.list.splice(index, 1)
            state.list.splice(index,0,value)
        } else {
            state.list.push(value)
        }
    },
    remove(state, value: ICollectionItem){
        const index = state.list.findIndex( s=> s.id === value.id)
        if(index >= 0){
            // delete
            state.list.splice(index, 1)
        } 
    }
})

const getters = (): GetterTree<IBasicCollection, IGlobalState> => ({
    byID: state => (id: string|number) =>{
        return state.list.find(s=>s.id === id)
    }
})

const onError = (collection: string) => (e: any)=>{
    console.log(`Error on collection: ${collection}`,e)
}

const onNext = ({commit}: {commit: Commit}) => (snapshot: firebaseApp.firestore.QuerySnapshot) => {
    snapshot.docChanges().forEach(change =>{
        const { type, newIndex, oldIndex, doc} = change
        const item = Object.assign({id:doc.id},doc.data())
        switch(type){
            case 'added':
            case 'modified':
                commit('replace', item)
                break;
            case 'removed':
                commit('remove', item)
                break;
        }
    })
}

const actions = (collection: string): ActionTree<IBasicCollection, IGlobalState> => ({
    init({commit, state}){
        // Listening to firebase
        state.unsubscribe = firebase.db().collection(collection).onSnapshot({ error:onError(collection), next:onNext({commit})})
    }, 
    async put({commit}, document: any){
        try{
            await firebase.db().collection(collection).doc(document.id).set(document)
        }catch(e){
            console.log(e)
        }
    },
    async patch({commit}, partial: ICollectionItem){
        try{
            await firebase.db().collection(collection).doc(partial.id).set(partial, {merge: true})
        }catch(e){
            console.log(e)
        }
    },
    async add({state, dispatch},document: ICollectionItem){
        if(state.list.find((i: ICollectionItem)=>i.id === document.id)){
            throw new Error(`A document with id: "${document.id}" already exists in collection: ${collection}`)
        }
        return dispatch(`put`,document)
    },
    async edit({state, dispatch},partial: ICollectionItem){
        if(!state.list.find((i: ICollectionItem)=>i.id === partial.id)){
            throw new Error(`There is no document with id: "${partial.id}" in collection: ${collection}`)
        }
        return dispatch(`patch`,partial)
    },
    async replace({state, dispatch},document: ICollectionItem){
        if(!state.list.find((i: ICollectionItem)=>i.id === document.id)){
            throw new Error(`There is no document with id: "${document.id}" in collection: ${collection}`)
        }
        return dispatch(`put`,document)
    },
    async remove({state}, id: string){
        if(!state.list.find((i: ICollectionItem)=>i.id === id)){
            throw new Error(`There is no document with id: "${id}" in collection: ${collection}`)
        }

        try{
            await firebase.db().collection(collection).doc(id).delete()
        }catch(e){
            console.log(e)
        }
    },
    stop({state}){
        if(state.unsubscribe){
            state.unsubscribe()
        }

        state.unsubscribe = null;
    }  
})

const useCollection = (collection: string)=>{
    const store = useStore()
    return {
        [collection]:computed(()=>(store.state as any)[collection]['list']) as any,
        add:(document: ICollectionItem)=>store.dispatch(`${collection}/add`,document),
        edit:(partial: ICollectionItem)=>store.dispatch(`${collection}/edit`,partial),
        replace:(document: ICollectionItem)=>store.dispatch(`${collection}/replace`,document),
        remove:(id: string)=>store.dispatch(`${collection}/remove`,id),
    }
}

export {useCollection}
export default (collectionName: string, extent: {state?: any;mutations?: any;actions?: any;getters?: any} = {})=>({
    namespaced: true,
    state: Object.assign({},state(), extent.state || {}),
    mutations: Object.assign({},mutations(), extent.mutations || {}),
    actions: Object.assign(actions(collectionName), extent.actions || {}),
    getters: Object.assign({},getters(), extent.getters || {}),
  })