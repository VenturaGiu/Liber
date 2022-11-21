<script>
	// @ts-nocheck
	
	import { requiresLogin, getData, putData } from "../+page";
	
	
	requiresLogin()
	
	import { Alert, Badge, Button, Card, Checkbox, Modal, P, Rating } from "flowbite-svelte";
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { redirect } from "@sveltejs/kit";
	
	let genres = '', resp = '', modalMessageOk = false, id = ''
	
	async function save(group){
        if(browser) id = window.sessionStorage.getItem('id') === undefined ? '' : window.sessionStorage.getItem('id')
		putData(`http://localhost:3000/api/app_user/update/infos/`, {
			"_id": id,
			"genres": group,
		}).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			
			if(data && data.message === 'Dados atualizados com sucesso!') {
                if (browser) return await goto('/logged');
				else throw redirect(302, '/logged');
            }
		});
	}

    async function getGenres() {
        getData(`http://localhost:3000/api/app_genre/`,).then(async (data) => {
			genres = data
			console.log(genres)
		})
    }
    
    const temp = setInterval(() => {
        getGenres()
        if(temp) clearInterval(temp)
    }, 100);
    let group = [];
	</script>
	
	<svelte:head>
	<title>Usuários</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <br>
	<div id="container" class="grid items-end md:grid-cols-1" >
		<P size="2xl">Escolha as palavras que mais te representam!</P>
		<P size="2xl">Com elas iremos apresentar os anúncios de sua preferência</P>
		<P size="2xl">Escolha no mínimo 3</P>
	</div>
    <br>
    <div id="container">
        {#if genres}
            <div class="grid items-center md:grid-cols-5" >
                {#each genres as genre}
                <Checkbox custom bind:group value={genre._id}>
                    <div style="margin: 5px; height: 100px; display: inline-block;" class="font-normal p-5 w-full text-gray-500 bg-white rounded-lg border-2 border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <div class="w-full text-lg font-semibold" style="margin-top: 10px"><center>{genre.name}</center></div>
                    </div>
                </Checkbox>
                {/each}
            </div>
        {/if}
        <br>
        {#if group.length >= 3}
            <Button on:click={save(group)}>Register</Button>
        {/if}
    </div>
      <div class="my-2 border border-gray-200 dark:border-gray-700 rounded-lg p-2 w-44">Group: {group}</div>
</section>

<style type="scss">
	
	#container{
		padding-left: 10%;
		padding-right: 10%;
	}
	
</style>
