<template>
    <div>
        <h1>{{collection}}</h1>
        <ul>
            <li v-for="item in items" :key="item.id">
                {{item}}
            </li>
        </ul>

        <form>
            <div><label>ID</label><input v-model="id"/></div>
            <div><label>Name</label><input v-model="name"/></div>
            <div>
                <label>Prop</label>
                <input v-model="prop_name"/>
                <span class="ion-margin-horizontal">-</span>
                <input v-model="prop_value"/>
            </div>
        </form>
        <div class="actions">
            <button @click="add(getEdition())">New</button>
            <button @click="edit(getEdition())">Edit</button>
            <button @click="replace(getEdition())">Replace</button>
            <button @click="remove(id)">Delete</button>
        </div>
    </div>
</template>

<script lang="ts">
import { useCollection } from '../store'
import { defineComponent, ref } from 'vue'

export default defineComponent({
    props:{collection:{type:String, required:true}},
    setup(props) {
        const name = ref('')
        const id = ref('')
        const prop_name = ref('')
        const prop_value = ref('')
        const getEdition = ()=>Object.assign({id:id.value},name.value ? {name:name.value}:{} ,prop_name.value ? {[prop_name.value]:prop_value.value}:{})
        const {[props.collection]:items, ...rest} = useCollection(props.collection)

        return {name, id, prop_name, prop_value, getEdition, items, ...rest}
    },
})


// export default defineComponent({
//    props:{collection:{type:String, required:true}},
//    data(){
//        return {
//            name: '',
//            id: '',
//            prop_name: '',
//            prop_value: '',
//        }
//    },
//    computed:{
//        items(): any[]{
//            return this.$store.state[this.collection].list
//        }
//    },
//    methods:{
//        getEdition(){
//            return Object.assign({id:this.id},this.name ? {name:this.name}:{} ,this.prop_name ? {[this.prop_name]:this.prop_value}:{})
//        },
//        add(document: any){
//            this.$store.dispatch(`${this.collection}/add`, document)
//        },
//        edit(partial: any){
//            this.$store.dispatch(`${this.collection}/edit`, partial)
//        },
//        replace(document: any){
//            this.$store.dispatch(`${this.collection}/replace`, document)
//        },
//        remove(id: string){
//            this.$store.dispatch(`${this.collection}/remove`, id)
//        },
//    }
// })
</script>

<style scoped>
    ul{
        text-align: left;
    }

    form{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 100%;
    }

    form div{
        display:flex;
        justify-content: flex-start;
        width: 100%;
    }

    form div *{
        margin-bottom: 16px;
    }

    form div :first-child{
        text-align: left;
        width: 10%;
    }

    .actions{
        display: flex;
        justify-content: flex-start;
    }

    .actions > *{
        margin-right: 8px;
    }
</style>

