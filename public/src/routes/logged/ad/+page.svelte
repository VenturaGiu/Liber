<script>
// @ts-nocheck

	import { browser } from "$app/environment";
	import { Input, Card, Dropzone, Label, P, Toggle, ButtonGroup, Button, Badge, Select, Alert } from "flowbite-svelte";
	let  avatar, fileinput;
	const imgUrl = new URL('../../../lib/images/default-img.png', import.meta.url).href
	const addImg = new URL('../../../lib/images/add.png', import.meta.url).href
	const bookImg = new URL('../../../lib/images/bookIcon.png', import.meta.url).href
	// @ts-nocheck
	
	import { requiresLogin, getData, postData, postImg } from "../+page";
	
	requiresLogin()
	let isbn = '', book = '', authors = '', price = '', id = ''

	if(browser) id = window.sessionStorage.getItem('id') === undefined ? '' : window.sessionStorage.getItem('id')

	async function uploadImage(image, idAd) {
		const formData = new FormData();
    	formData.append("image", image);
		postImg(`http://localhost:3000/upload/image/${idAd}`, formData).then((data) => {
			resp = data
		});
	}

	async function getBook(isbn) {
		getData(`http://localhost:3000/api/app_book/${isbn}`,).then(async (data) => {
			book = data
			let key = 0
			for(const b of book.authors){
				if(book.authors.length-1 === key){
					authors += b
				}else{
					authors += b + ', '
				}
				key += 1
			}
			console.log(book)
		})
	}
	let image
	const onFileSelected =(e)=>{
		image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = e => {
			avatar = e.target.result
		};
	}

	let colors = ["red", "dark", "green", "yellow", "indigo", "purple", "pink"]
	let resp
	let selected;
	let type_ads = [
		{value:"venda", name: "Vender"},
		{value:"troca", name: "Trocar"},
	]

	async function saveBook(bookID) {
		console.log(bookID)
		postData('http://localhost:3000/api/app_ad/', {
			"id_user": id,
			"id_book": bookID,
			"type_ad": selected,
			"price": price
		}).then((data) => {
			resp = data
			uploadImage(image, data._id)
		});
	}

	async function saveBookSwap(bookID) {
		console.log(bookID)
		postData('http://localhost:3000/api/app_ad/', {
			"id_user": id,
			"id_book": bookID,
			"type_ad": selected,
		}).then((data) => {
			resp = data
			uploadImage(image, data._id)
		});
	}

	</script>
	
	<svelte:head>
	<title>Liber</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<br><br>
	<div id="container">
		<article class="article group" style="padding: 40px !important;">
				<h5 class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Digite o ISBN do livro!</h5>
				<br>
				<div class="pt-2">
					<ButtonGroup  class="w-full" size="md">
					  <Input bind:value={isbn} id="input-addon" type="email" placeholder="ISBN" />
					  <Button on:click={getBook(isbn)} style="width: auto !important;" color="blue">Search</Button>
					</ButtonGroup>
				</div>				  
		</article>
	</div>

	{#if book}
		<div id="container">
			<article class="article group">
				<img class="image book left" src="http://localhost:3000/books/{book.isbn}/{book._id}" alt="Image">
				<section class="content">
					<h5 class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{book.title}</h5>
					{#if book.subtitle}
						<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
							{book.subtitle}
						</p>
					{/if}
					<br>
					<p class="mb-3 text-2xl font-bold text-gray-700 dark:text-gray-400 leading-tight">Sinopse<p></p>
					<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 100%;">
						{book.synopsis}
					</p>
					<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 100%;">
						<strong>Escrito por:</strong> {authors}
					</p>
					<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
						<strong>Editora:</strong> {book.publisher}
					</p>
					<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 25%; float: left;">
						<strong>Ano:</strong> {book.year}
					</p>
					<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 25%; float: left;">
						<strong>Páginas:</strong> {book.page_count}
					</p>
					<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
						<strong>Linguagem:</strong> {book.language}
					</p>
					<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
						<strong>País:</strong> {book.location}
					</p>
					{#if book.dimensions}
						<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
							<strong>Altura:</strong> {book.dimensions.width}
						</p>
						<p class="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
							<strong>Largura:</strong> {book.dimensions.height}
						</p>
					{/if}
					{#if book.type_ad === 'venda'}
						<p class="mb-3 text-4xl font-normal text-gray-700 dark:text-gray-400 leading-tight" style="width: 50%; float: left;">
							<strong>R$ {book.price} </strong>
						</p>
					{/if}
					<br><br>
					{#each book.key_words as word, index}
						<Badge large={true} style="width: auto !important;" color={colors[index]}>{word}</Badge>
					{/each}
				</section>
			</article>
		</div>
	{/if}


	<div id="container">
		<article class="article group">
			<div class="grid items-center md:grid-cols-2" >
				<div class="containerImg">
					{#if avatar}
						<img class="avatar" src="{avatar}" alt="d" />
					{:else}
						<img class="avatar" src={bookImg} alt="" /> 
					{/if}
				<div class="selectImg">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<img style="cursor: pointer !important;" class="upload" src={addImg} alt="" on:click={()=>{fileinput.click();}} />
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="chan" on:click={()=>{fileinput.click();}} style="cursor: pointer !important;" ></div>
					<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
				</div>
			</div>
			<section style="padding-right: 100px;">
				<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Você irá vender ou trocar o livro?</h5>
				<Label>
					<Select class="mt-3" items={type_ads} bind:value={selected} />
				</Label>
				{#if selected === 'venda'}
					<br>
					<h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Qual o preço do seu livro?</h5>
					<div class="pt-2">
						<ButtonGroup  class="w-full" size="md">
						  <Input bind:value={price} id="input-addon" type="email" placeholder="Preço" />
						</ButtonGroup>
					</div>	
					<br>
					<Button style="width: 100%;" outline gradient color="cyanToBlue" on:click={saveBook(book._id, image)} >Salvar</Button>
				{/if}
				{#if selected === 'troca'}
					<br>
					<Button style="width: 100%;" outline gradient color="cyanToBlue" on:click={saveBookSwap(book._id, image)} >Salvar</Button>
				{/if}
				{#if resp}
					<br>
					<Alert color="green">
						<span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
						</span>
						<span class="font-small">Anúncio cadastrado com sucesso!</span>
					</Alert>
				{/if}
			</section>
		</article>
	</div>
</section>

<style type="scss">
	#container{
		padding-left: 10%;
		padding-right: 10%;
	}

	.containerImg{
		max-width: 400px;
		height: 500px;
		position: relative;
		background-color: rgb(235, 235, 235);
	}

	.avatar{
		position: relative;
	}

	.selectImg{
		position: absolute;
		bottom: 0;
		margin-right: -80px;
		right: 0;
		img{
			width: 180px;
		}
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
  width: 60%;
  float: left;
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
