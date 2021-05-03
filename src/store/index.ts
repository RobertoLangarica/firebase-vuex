import { store } from './store'
import { useCollection } from './basic_collection'
import { InjectionKey } from 'vue'
import { Store, useStore as baseUseStore } from 'vuex'
import { IGlobalState } from './store'


export const key: InjectionKey<Store<IGlobalState>> = Symbol()

export function useStore(){
    return baseUseStore(key)
}

export { useCollection }
export default store