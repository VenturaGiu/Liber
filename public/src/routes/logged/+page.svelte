<script>
	// @ts-nocheck
	
	import { requiresLogin, getData } from "./+page";
	
	// @ts-ignore
	import { Slidy } from '../../../node_modules/svelte-slidy';
	
	requiresLogin()
	
	import { browser } from "$app/environment";
	import { redirect } from "@sveltejs/kit";
	import { goto } from "$app/navigation";
	import { Badge, Button, Card, P, Rating } from "flowbite-svelte";
	let name = 'Slidy'
	
	let resps
	let books
	
	/**
	* @type {{ id: any; }[]}
	*/
	const cards = []
	let slidy_cards
	
	async function getBooks() {
		getData('http://localhost:3000/api/app_ad/get/all/books',).then(async (data) => {
			books = data
			console.log(books)
		})
	}
	
	async function getRecommend(id) {
		getData(`http://localhost:3000/api/app_user/ia/recommendations/${id}`,).then(async (data) => {
			resps = data
			for (const resp of resps){
				cards.push({
					id: resp._id,
					header: resp.book.title,
					text: resp.type_ad === 'venda' ? `${resp.type_ad}: R$${resp.price}` : resp.type_ad,
					src: `http://localhost:3000/books/${resp.book.isbn}/${resp._id}`
				})
			}
			console.log(cards)
		});
		slidy_cards = {
			slides: cards,
			wrap: {
				id: 'slidy_cards',
				width: '100vw',
				height: '100vh',
				padding: '50px 0 50px',
				align: 'middle',
				alignmargin: 0,
			},
			slide: {
				gap: 50,
				width: '80vw',
				height: '100vh',
				backimg: false,
				imgsrckey: 'src',
				objectfit: 'contain',
			},
			controls: {
				dots: true,
				dotsnum: true,
				dotsarrow: true,
				dotspure: true,
				arrows: false,
				keys: true,
				drag: true,
				wheel: true,
			},
			options: {
				axis: 'x',
				loop: true,
				duration: 350,
			}
		}
	}
	
	let tempo = setInterval(() => {
		getBooks()
		if (tempo) {
			clearInterval(tempo);
		}
	}, 100);
	let tempo2 = setInterval(() => {
		if (browser) {
    		const id = window.sessionStorage.getItem('id') === undefined ? '' : window.sessionStorage.getItem('id')
			getRecommend(id)
		}
		if (tempo2) {
			clearInterval(tempo2);
		}
	}, 200);
	</script>
	
	<svelte:head>
	<title>Usuários</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<!-- <Button on:click={getRecommend} >teste</Button> -->
	<br>
	<div id="container" class="grid items-end md:grid-cols-1">
		<P size="2xl">Recomendações selecionadas especialmente pra você!</P>
	</div>
	{#if resps}
	<Slidy {...slidy_cards} let:item >
		<div class="slide">
			<a href='/logged/book?id={item.id}'><img alt="{item.header}" src="{item.src}"/></a>
			<article style="margin-top: 20px;">
				<P class='font-bold' size="lg">
					{item.header}
				</P>
				<P>
					{item.text}
				</P>
			</article>
		</div>
	</Slidy>
	{/if}
	
	<br>

	<div id="container" class="grid items-end md:grid-cols-1" >
		<P size="2xl">Mais livros para você!</P>
	</div>
	<div id="container" class="grid items-end md:grid-cols-4" >
		{#if books && books.length !== 0}
			{#each books as book}
				<!-- <p>${book._id}</p> -->

				<Card padding="none" style="margin: 25px">
					<a href="/logged/book?id={book._id}">
						<center>
							<img class="p-8 rounded-t-lg" src="http://localhost:3000/books/{book.id_book.isbn}/${book._id}.png" alt="product 1" />
						</center>
					</a>
					<div class="px-5 pb-5">
						<a href="/logged/book?id={book.id_book._id}">
							<h5 class='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
								{book.id_book.title}
							</h5>
						</a>
						<br>
						<div class="flex justify-between items-center">
							{#if book.type_ad === 'troca'}
								<span class="text-xl text-gray-900 dark:text-white">
									Disponível para troca
								</span>
							{/if}
							{#if book.type_ad === 'venda'}
								<span class="text-3xl text-gray-900 dark:text-white">
									R${book.price}
								</span>
							{/if}
							<span class="text-3xl font-bold text-gray-900 dark:text-white">
							</span>
						</div>
						<br>
						<span class="text-small text-gray-900 dark:text-white">
							Vendido por: {book.id_user.name}
						</span>
						<br>
						<Button gradient color="cyanToBlue" href="/logged/book?id={book._id}">Ver mais</Button>
					</div>
				</Card>
			{/each}
		{/if}
		
	</div>
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
