<script>
// @ts-nocheck

	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { redirect } from "@sveltejs/kit";
	import { Alert, Badge, Button, Card, Label, Modal, P, Toggle } from "flowbite-svelte";

	const imgUrl = new URL('../../../lib/images/user.png', import.meta.url).href
	// @ts-nocheck
	
	import { requiresLogin, getData, postData } from "../+page";
	
	requiresLogin()
	
	let books = []
	let authors = '', defaultModal = false, id = '', useri = '', swapModal = false, adsSwap = [], respSwapOk = ''
	
	async function getBooks() {
		if(browser){
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const id = urlParams.get('id')
			console.log(id)
			getData(`http://localhost:3000/api/app_ad/get/${id}`,).then(async (data) => {
				books = data
				let key = 0
				for(const b of books.id_book.authors){
					if(books.id_book.authors.length-1 === key){
						authors += b
					}else{
						authors += b + ', '
					}
					key += 1
				}
				console.log(books)
			})
		}
	}
	let tempo = setInterval(() => {
		getBooks()
		if(tempo){
			clearInterval(tempo)
		}
	}, 100);
	let hCard = false, modalMessageOk = false, useriBook = '';

	let colors = ["red", "dark", "green", "yellow", "indigo", "purple", "pink"]

	async function getUserInfos() {
		defaultModal = true
		if(browser) id = window.sessionStorage.getItem('id') === undefined ? '' : window.sessionStorage.getItem('id')
		getData(`http://localhost:3000/api/app_user/listAllIfosUserBuy/${id}`,).then(async (data) => {
			useri = data
			console.log(useri)
		})
	}

	async function getBooksInfos() {
		swapModal = true
		if(browser) id = window.sessionStorage.getItem('id') === undefined ? '' : window.sessionStorage.getItem('id')
		getData(`http://localhost:3000/api/app_ad/${id}`,).then(async (data) => {
			adsSwap = data
			getData(`http://localhost:3000/api/app_user/listAllIfosUserBuy/${id}`,).then(async (data) => {
				useriBook = data
				console.log(useri)
			})
			console.log(adsSwap)
		})
	}
	
	async function buy(useri, books){
		postData(`http://localhost:3000/api/app_ad/buy/${books}`, {
			"type_ad": "venda",
			"id_user_buy": useri
		}).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			if(browser && data){
				const location = '/logged/mybooks'
				if (browser) return await goto(location);
				else throw redirect(302, location);
			}
		});
	}

	async function swap(useri, books, bookSol, userAd){
		postData(`http://localhost:3000/api/app_ad/buy/${books}`, {
			"type_ad": "troca",
			"id_user": userAd,
			"id_ad": books,
			"id_user_solicitation": useri,
			"id_ad_solicitation": bookSol,
		}).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			respSwapOk = data
			modalMessageOk = true
		});
	}

	</script>
	
	<svelte:head>
	<title>Livro</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<br><br>
	{#if books && books.length !== 0 }
	<div id="container">
		<article class="article group">
			<img class="image book left" src="http://localhost:3000/books/{books.id_book.isbn}/{books._id}" alt="Image">
			<section class="content">
				<h5 class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{books.id_book.title}</h5>
				{#if books.id_book.subtitle}
					<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
						{books.id_book.subtitle}
					</p>
				{/if}
				<br>
				<p class="mb-3 text-2xl font-bold text-gray-700 dark:text-gray-400 leading-tight">Sinopse<p></p>
				<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 100%;">
					{books.id_book.synopsis}
				</p>
				<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 100%;">
					<strong>Escrito por:</strong> {authors}
				</p>
				<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
					<strong>Editora:</strong> {books.id_book.publisher}
				</p>
				<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 25%; float: left;">
					<strong>Ano:</strong> {books.id_book.year}
				</p>
				<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 25%; float: left;">
					<strong>Páginas:</strong> {books.id_book.page_count}
				</p>
				<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
					<strong>Linguagem:</strong> {books.id_book.language}
				</p>
				<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
					<strong>País:</strong> {books.id_book.location}
				</p>
				{#if books.id_book.dimensions}
					<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
						<strong>Altura:</strong> {books.id_book.dimensions.width}
					</p>
					<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
						<strong>Largura:</strong> {books.id_book.dimensions.height}
					</p>
				{/if}
				{#if books.type_ad === 'venda'}
					<p class="mb-3 text-4xl font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
						<strong>R$ {books.price} </strong>
					</p>
				{/if}
				<br><br>
				{#each books.id_book.key_words as word, index}
					<Badge large={true} style="width: auto !important;" color={colors[index]}>{word}</Badge>
				{/each}
			</section>
		</article>

		{#if !books.id_user_buy}
			<article class="article group">
				{#if books.type_ad === 'venda'}
					<Button gradient color="greenToBlue" on:click={getUserInfos}>Comprar</Button>
				{/if}
				{#if books.type_ad === 'troca'}
					<Button gradient color="greenToBlue" on:click={getBooksInfos} >Trocar</Button>
				{/if}
			</article>
		{/if}

		<article class="article group">
			<img class="image user left" src="http://localhost:3000/users/{books.id_user._id}.png" alt="Image">
			<section class="content" style="width: 80% !important;">
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{books.id_user.name}</h5>
				<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 100%;">
					<strong>Tipo da conta:</strong> {books.id_user.account_type}
				</p>
				<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 100%;">
					<strong>E-mail para contato:</strong> {books.id_user.email}
				</p>
			</section>
		</article>
	</div>
	{/if}

	<Modal title="Detalhes da troca" size="xl" bind:open={swapModal}>
		<article class="article group" style="margin: 0 !important;" >
			{#if useriBook}
				<article class="article group" style="margin: 0 !important; border: 1px solid cyan" >
						<h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Endereço de entrega</h5>
						<br>
						<div class="grid gap-3 mb-3 md:grid-cols-4" >
							<Label class="space-y-2">
								<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Nome do endereço</h5>
								<span>{useriBook.address.name}</span>
							</Label>
							<Label>
								<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Logradouro</h5>
								<span>{useriBook.address.road}</span>
							</Label>
							<Label class="space-y-2">
								<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">CEP</h5>
								<span>{useriBook.address.cep}</span>
							</Label>
							<Label class="space-y-2">
								<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Cidade</h5>
								<span>{useriBook.address.city}</span>
							</Label>
						</div>
						<div class="grid gap-3 mb-3 md:grid-cols-3" >
							<Label class="space-y-2">
								<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Estado</h5>
								<span>{useriBook.address.state}</span>
							</Label>
							<Label class="space-y-2">
								<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Number</h5>
								<span>{useriBook.address.number}</span>
							</Label>
							<Label class="space-y-2">
								<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Complemento</h5>
								<span>{useriBook.address.complement}</span>
							</Label>
						</div>
				</article>
			{/if}
			{#if adsSwap }
			<div class="grid gap-3 mb-3 md:grid-cols-3" >
				{#each adsSwap as ads}	
					{#if ads.type_ad && ads.type_ad === 'troca' && !ads.id_user_buy }
							<Card padding="none" style="margin: 25px">
								<a href="/logged/book?id={ads._id}">
									<center>
										<img class="p-8 rounded-t-lg" src="http://localhost:3000/books/{ads.id_book.isbn}/{ads._id}" alt="product 1" />
									</center>
								</a>
								<div class="px-5 pb-5">
									<a href="/logged/book?id={ads.id_book._id}">
										<h5 class='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
											{ads.id_book.title}
										</h5>
									</a>
									<br>
									<div class="flex justify-between items-center">
										{#if ads.type_ad === 'troca'}
											<span class="text-xl text-gray-900 dark:text-white">
												Disponível para troca
											</span>
										{/if}
										{#if ads.type_ad === 'venda'}
											<span class="text-3xl text-gray-900 dark:text-white">
												R${ads.price}
											</span>
										{/if}
										<span class="text-3xl font-bold text-gray-900 dark:text-white">
										</span>
									</div>
									<br>
									<Button gradient color="cyanToBlue" on:click={swap(useriBook._id, books._id, ads._id, books.id_user._id)}>Trocar por esse</Button>
								</div>
							</Card>
							{/if}
							{/each}
						</div>
			{/if}
		</article>
	</Modal>

	<Modal title="Detalhes da compra" bind:open={defaultModal}>
		{#if useri}
			<article class="article group" style="margin: 0 !important; border: 1px solid cyan" >
				<h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Cartão para pagamento</h5>
				<br>
				<div class="grid gap-3 mb-3 md:grid-cols-2" >
					<Label class="space-y-2">
						<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Nome do cartão</h5>
						<span>{useri.cards.name_card}</span>
					</Label>
					<Label class="space-y-2">
						<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Número do cartão</h5>
						<span>{useri.cards.number}</span>
					</Label>
				</div>
				<div class="grid gap-3 mb-3 md:grid-cols-2" >
					<Label class="space-y-2">
						<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Data de validade</h5>
						<span>{useri.cards.expiration_date}</span>
					</Label>
					<Label class="space-y-2">
						<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">CVV</h5>
						<span>{useri.cards.cvv}</span>
					</Label>
				</div>
				<div class="grid gap-3 mb-3 md:grid-cols-2" >
					<Label class="space-y-2">
						<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">CPF</h5>
						<span>{useri.cards.cpf}</span>
					</Label>
					<Label class="space-y-2">
						<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Titular do cartão</h5>
						<span>{useri.cards.cardholder}</span>
					</Label>
				</div>
			</article>
			<br>
			<article class="article group" style="margin: 0 !important; border: 1px solid cyan" >
					<h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Endereço de entrega</h5>
					<br>
					<div class="grid gap-3 mb-3 md:grid-cols-2" >
						<Label class="space-y-2">
							<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Nome do endereço</h5>
							<span>{useri.address.name}</span>
						</Label>
						<Label>
							<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Logradouro</h5>
							<span>{useri.address.road}</span>
						</Label>
					</div>
					
					<br>
					<Label class="space-y-2">
						<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">CEP</h5>
						<span>{useri.address.cep}</span>
					</Label>
					<br>
					<div class="grid gap-3 mb-3 md:grid-cols-2" >
						<Label class="space-y-2">
							<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Cidade</h5>
							<span>{useri.address.city}</span>
						</Label>
						<Label class="space-y-2">
							<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Estado</h5>
							<span>{useri.address.state}</span>
						</Label>
					</div>
					<div class="grid gap-3 mb-3 md:grid-cols-2" >
						<Label class="space-y-2">
							<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Number</h5>
							<span>{useri.address.number}</span>
						</Label>
						<Label class="space-y-2">
							<h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Complemento</h5>
							<span>{useri.address.complement}</span>
						</Label>
					</div>
			</article>
			<Button gradient color="greenToBlue" on:click={buy(useri._id, books._id)}>Finalizar compra</Button>
		{/if}
	</Modal>

	<Modal bind:open={modalMessageOk} size="xs" autoclose>
		{#if respSwapOk}
			<Alert color="green">
				<span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
				</span>
				<span class="font-small">{respSwapOk.message}</span>
			</Alert>
		{/if}
	</Modal>
</section>

<style type="scss">
	#container{
		padding-left: 10%;
		padding-right: 10%;
	}

	*{
  box-sizing: border-box;
}
.article{
  width: 100%;
  height: auto;
  margin:30px;
  padding:12px;
  border-radius:5px;
  -webkit-box-shadow: 0px 0px 12px 0px rgba(153, 153, 153, 0.394);
	-moz-box-shadow: 0px 0px 12px 0px rgba(153, 153, 153, 0.394);
	box-shadow: 0px 0px 12px 0px rgba(153,153,153, 0.394);
}
.book{
	min-width: 400px;
	max-width: 400px;
	width: auto;
	border-radius: 5px;
}
.user{
	min-width: 150px !important;
	max-width: 150px !important;
	height: 150px !important;
	border-radius: 360px ;
}
.image{
  height: auto;
  font-size:8rem;
  
  &.left{
    float:left;
    margin-right:30px;
  }
}
.content{
  padding: 10px 50px 10px 10px;
  height: auto;
  width: 65%;
  float: left;
  .headline{
  }
}

//ClearFix
.group{
  &:before,
  &:after {
    content: "";
    display: table;
  } 
  &:after {
    clear: both;
  }
}

</style>
