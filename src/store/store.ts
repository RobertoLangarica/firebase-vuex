import { createStore } from 'vuex'
import basicCollection, { IBasicCollection } from './basic_collection';

export interface IGlobalState {
    examples: IBasicCollection;
}

const store = createStore<IGlobalState>({
    modules: {
        examples:basicCollection('examples')
    },
    actions:{
        init({ dispatch}){
            Object.keys((this as any)._modulesNamespaceMap).forEach(module=>{
                dispatch(`${module}init`)
            })
        }
    }
})

export {store}