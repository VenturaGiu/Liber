<script>
	// @ts-nocheck
	
	import { requiresLogin, getData } from "../+page";
	
	requiresLogin()
	
	let books
	
	async function getBooks(params) {
		getData('http://localhost:3000/api/app_ad/get/all/books',).then(async (data) => {
			books = data
			console.log(books)
		})
	}
	
	let tempo = setInterval(() => {
		getBooks()
		clearInterval(tempo)
	}, 100);

	</script>
	
	<svelte:head>
	<title>Usuários</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div id="container" class="grid items-end md:grid-cols-1">
		a
	</div>
</section>

<style>
	
	#container{
		padding-left: 10%;
		padding-right: 10%;
	}
	
</style>
