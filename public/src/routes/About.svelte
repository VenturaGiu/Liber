<script lang="ts">
    import { push, pop, replace } from 'svelte-spa-router'

    interface param {
        teste: string
    }
    export let params:param = {} as param

    console.log(params)

    const go_home = () => {
        push('/')
    }
</script>

<h1>Aqui é a página de about</h1>
<h2>{params.teste}</h2>

<button on:click={(go_home)} >Go Home</button>