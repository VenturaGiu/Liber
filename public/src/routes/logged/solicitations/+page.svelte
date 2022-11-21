<script>
	// @ts-nocheck
	
	import { requiresLogin, getData, putData } from "../+page";
	
	
	requiresLogin()
	
	import { browser } from "$app/environment";
	import { redirect } from "@sveltejs/kit";
	import { goto } from "$app/navigation";
	import { Alert, Badge, Button, Card, Modal, P, Rating } from "flowbite-svelte";
	
	let books, resp = '', modalMessageOk = false
	
	async function getBooks(id) {
		getData(`http://localhost:3000/api/app_ad/solicitation/user/${id}`,).then(async (data) => {
			books = data
			console.log(books)
		})
	}

	async function accept(id, id_user, id_ad, id_user_solicitation, id_ad_solicitation){
		putData(`http://localhost:3000/api/app_ad/solicitation/accept/${id}`, {
			"id_user": id_user,
			"id_ad": id_ad,
			"id_user_solicitation": id_user_solicitation,
			"id_ad_solicitation": id_ad_solicitation
		}).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			modalMessageOk = true
			if(data) resp = data
		});
	}
	
	let tempo = setInterval(() => {
		if (browser) {
    		const id = window.sessionStorage.getItem('id') === undefined ? '' : window.sessionStorage.getItem('id')
			console.log(id)
			getBooks(id)
		}
		if (tempo) {
			clearInterval(tempo);
		}
	}, 100);

	</script>
	
	<svelte:head>
	<title>Usuários</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div id="container" class="grid items-end md:grid-cols-1" >
		<P size="2xl">Solicitações</P>
	</div>
	<div id="container" class="grid items-end md:grid-cols-4" >
		{#if books && books._id}
			<Card padding="none" style="margin: 25px">
				<a href="/logged/book?id={books.book_ad._id}">
					<center>
						<img class="p-8 rounded-t-lg" src="http://localhost:3000/books/{books.book_ad.isbn}.png" alt="product 1" />
					</center>
				</a>
				<div class="px-5 pb-5">
					<p>Deseja trocar esses livros?</p>
					<p>Clique no link abaixo para ver mais!</p>
					<br>
					<a href="/logged/book?id={books.book_ad_solicitation._id}">
						<h5 class='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
							{books.book_ad_solicitation.title}
						</h5>
					</a>
					<br>
					<div class="flex justify-between items-center">
						<p>Solicitação realizada por:</p>
						<br>
						<h5 class='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
							{books.id_user_solicitation.name}
						</h5>
					</div>
					<br>
					<Button gradient color="greenToBlue" on:click={accept(books._id, books.id_user._id, books.id_ad._id, books.id_user_solicitation._id, books.id_ad_solicitation._id)} >Aceitar</Button>
					<br><br>
					<Button gradient color="redToYellow" href="/logged/bookedit?id={books._id}">Recusar</Button>
				</div>
			</Card>
		{/if}
		
	</div>

	<Modal bind:open={modalMessageOk} size="xs" autoclose>
		{#if resp}
			<Alert color="green">
				<span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
				</span>
				<span class="font-small">{resp.message}</span>
			</Alert>
		{/if}
	</Modal>
</section>

<style>
	
	#container{
		padding-left: 10%;
		padding-right: 10%;
	}
	
	@media screen and (min-width: 500px) {
		:global(#slidy_cards .slidy-ul li) {width: 70vw;}
	}	
	@media screen and (min-width: 600px) {
		:global(#slidy_cards .slidy-ul li) {width: 50vw;}
	}
	@media screen and (min-width: 700px) {
		:global(#slidy_cards .slidy-ul li) {width: 33vw;}
	}
	:global(#slidy_cards .slidy-ul li img) {
		transform: scale(1);
		transition: transform 350ms, box-shadow 350ms;
	}
	:global(#slidy_cards .slidy-ul li) {overflow: visible}
	:global(#slidy_cards .slidy-ul li.active img) {
		transform: scale(1.15);
		box-shadow: 0 14px 25px rgba(0, 0, 0, 0.36);
	}
	:global(body) { margin: 0; padding: 0}
	.slide {
		position: relative;
		display: flex;
		flex-flow: column;
		text-align: center;
		align-content: center;
		justify-content: center;
		height: 100%;
		border-radius: 1rem;
		top: 0 !important;
		margin-bottom: 40% !important;
	}
	.slide img {
		max-height: 200px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		vertical-align: middle;
		object-fit: cover;
		position: relative;
		z-index: 1;
		border-radius: 1rem;
		box-shadow: 0 14px 25px rgba(0, 0, 0, 0.16);
	}
	.slide article {
		padding: 1rem;
	}
	h1 {text-align: center;}
	h1 span {color: cyan !important}
	h2 {color: black !important}
	p {color: black !important}
	
</style>
