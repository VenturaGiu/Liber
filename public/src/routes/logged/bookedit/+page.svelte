<script>
// @ts-nocheck

	import { browser } from "$app/environment";
	import { Badge, Button, ButtonGroup, Input, Label, P, Select, Toggle } from "flowbite-svelte";

	const imgUrl = new URL('../../../lib/images/user.png', import.meta.url).href
	// @ts-nocheck
	
	import { requiresLogin, getData, putData, deleteData } from "../+page";
	
	requiresLogin()
	
	let books = []
	let authors = '' 
	let price = '0.0'
	let selected;
	
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
				if(books.price !== undefined) {
					price = books.price
				}
				else price = '0.0'
				console.log(price)
				selected = books.type_ad
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
	let hCard = false;

	let type_ads = [
		{value:"venda", name: "Vender"},
		{value:"troca", name: "Trocar"},
	]

	let colors = ["red", "dark", "green", "yellow", "indigo", "purple", "pink"]


	async function updateAd(id, price){
		if(selected === 'troca') price = ''
		putData('http://localhost:3000/api/app_ad/', {
			"_id": id,
			"price": price,
			"type_ad": selected,
		}).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
		});
	}

	async function deleteAd(id){
		deleteData('http://localhost:3000/api/app_ad/', {
			"_id": id
		}).then(async (data) => {
			if(data._id){
				const location = '/logged/myads'
				if (browser) return await goto(location);
				else throw redirect(302, location);
			}
		});
	}

	</script>
	
	<svelte:head>
	<title>Liber</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<br><br>
	{#if books && books.length !== 0 }
	<div id="container">
		<article class="article group">
			<img class="image book left" src="http://localhost:3000/books/{books.id_book.isbn}.png" alt="Image">
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
				<br><br>
				{#if books.type_ad === 'venda'}
					<p class="mb-3 text-4xl font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
						<strong>R$ {books.price} </strong>
					</p>
				{/if}
				<br><br>
				{#each books.id_book.key_words as word, index}
					<Badge large={true} style="width: auto !important;" color={colors[index]}>{word}</Badge>
				{/each}
				<br><br>
				<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Editar tipo de anúncio</h5>
				<Label>
					<Select class="mt-3" items={type_ads} bind:value={selected} />
				</Label>
				{#if books.type_ad === 'venda' || selected === 'venda' && price}
					<br>
					<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Qual o preço do seu livro?</h5>
					<div class="pt-2">
						<ButtonGroup  class="w-full" size="md">
						<Input bind:value={price} id="input-addon" type="email" placeholder="Preço" />
						</ButtonGroup>
					</div>	
					<br>
				{/if}
			</section>
		</article>
		<article class="article group">
			<br>
			<Button gradient color="greenToBlue" on:click={updateAd(books._id, price)} >Salvar</Button>
			<br><br>
			<Button gradient color="redToYellow" on:click={deleteAd(books._id)} href="/logged/myads">Excluir</Button>
		</article>

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
