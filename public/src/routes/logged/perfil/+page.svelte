<script>
// @ts-nocheck

	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { redirect } from "@sveltejs/kit";
	import { Alert, Button, ButtonGroup, Hr, Input, Label, Modal, Radio, Select, Spinner } from "flowbite-svelte";
	import { bind } from "svelte/internal";
	import { requiresLogin, getData, putData, postData, deleteData } from "../+page";


	requiresLogin()

	let user = '', name = '', email = '', selected = '', resp = '', alert = false, loading = false, loadingmodal = false
	let number = '', cvv = '', cardholder = '', cpf = '', name_card = '', expiration_date = '', cardresp = '', main = false
	let number_a = '', name_a = '', cep = '', road = '', city = '', state = '', complement = '', main_a = false
	
	let defaultModal = false;
	let defaultModalAddress = false;
	let cards = []
	let address = []

	let account_type = [
		{value:"standard", name: "Padrão"},
		{value:"premium", name: "Premium"},
	]
	let card_type = [
		{value: true, name: "Principal"},
		{value: false, name: "Padrão"},
	]
	let address_type = [
		{value: true, name: "Principal"},
		{value: false, name: "Padrão"},
	]
	let selected_card = false

	let  avatar, fileinput;
	const imgUrl = new URL('../../../lib/images/default-img.png', import.meta.url).href
	const addImg = new URL('../../../lib/images/add.png', import.meta.url).href
	const bookImg = new URL('../../../lib/images/bookIcon.png', import.meta.url).href

	let image
	const onFileSelected =(e)=>{
		image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = e => {
			avatar = e.target.result
		};
	}

	async function getUser(id) {
		getData(`http://localhost:3000/api/app_user/${id}`,).then(async (data) => {
			user = data
			name = data.name
			email = data.email
			selected = data.account_type
			cards = user.cards
			address = user.address
			console.log(cards)
			console.log(user)
			avatar = `http://localhost:3000/users/${id}`
		})
	}

	let tempo2 = setInterval(() => {
		if (browser) {
    		const id = window.sessionStorage.getItem('id') === undefined ? '' : window.sessionStorage.getItem('id')
			getUser(id)
		}
		if (tempo2) {
			clearInterval(tempo2);
		}
	}, 200);

	async function updateUser(name, email, selected) {
		loading = true
		putData('http://localhost:3000/api/app_user/update/infos', {
			"name": name,
			"email": email,
			"account_type": selected,
		}).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			resp = data
			alert = true
			loading = false
			let tempAlert = setInterval(() => {
				alert = false
				if(tempAlert) clearInterval(tempAlert)
			}, 3000);
		});
	}

	async function saveNewCard(email, number, cvv, cardholder, cpf, name_card, expiration_date) {
		postData('http://localhost:3000/api/app_user/card', {
			"email": email,
			"number": number,
			"expiration_date": expiration_date,
			"cvv": cvv,
			"cardholder": cardholder,
			"cpf": cpf,
			"name_card": name_card,
			"main": main,
		}).then(async (data) => {
			loadingmodal = false
			cardresp = data
			const location = '/logged/perfil';
			cards.push(data)
			if(browser){
				document.location.reload(true);
			}
		});
	}

	async function deleteCard(id) {
		deleteData('http://localhost:3000/api/app_user/card', {
			"_id": id
		}).then(async (data) => {
			console.log(data)
			if(data){
				document.location.reload(true);
			}
		});
	}
	
	async function updateCard(id, number, cvv, cardholder, cpf, name_card, expiration_date, main){
		putData('http://localhost:3000/api/app_user/card', {
			"_id": id,
			"number": number,
			"expiration_date": expiration_date,
			"cvv": cvv,
			"cardholder": cardholder,
			"cpf": cpf,
			"name_card": name_card,
			"main": main,
		}).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			if(data){
				document.location.reload(true);
			}
		});
	}

	async function saveNewAddress(email, number_a, name_a, cep, road, city, state, complement, main_a) {
		postData('http://localhost:3000/api/app_user/card', {
			"email": email,
			"name": name_a,
			"cep": cep,
			"road": road,
			"city": city,
			"state": state,
			"number": number_a,
			"complement": complement,
			"main": false
		}).then(async (data) => {
			loadingmodal = false
			cardresp = data
			const location = '/logged/perfil';
			cards.push(data)
			if(browser){
				document.location.reload(true);
			}
		});
	}
</script>

<svelte:head>
	<title>Usuários</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div id="container">
		<article class="article group">
			<div class="grid items-start md:grid-cols-2" >
				<div class="containerImg">
					<img class="avatar" src="{avatar}" alt="d" />
				<div class="selectImg">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<img style="cursor: pointer !important;" class="upload" src={addImg} alt="" on:click={()=>{fileinput.click();}} />
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="chan" on:click={()=>{fileinput.click();}} style="cursor: pointer !important;" ></div>
					<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
				</div>
			</div>
			<section style="padding-right: 100px;">
				<h5 class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Editar dados</h5>
				<br>
				<Label class="space-y-2">
					<span>Nome</span>
					<Input bind:value={name} type="text" placeholder="Large input" size="lg" />
				</Label>
				<br>
				<Label class="space-y-2">
					<span>Email</span>
					<Input bind:value={email} type="text" disabled placeholder="Large input" size="lg" />
				</Label>
				<br>
				<Label>
					<span>Tipo de conta</span>
					<Select class="mt-3" items={account_type} bind:value={selected} />
				</Label>
				{#if resp.message === 'Dados atualizados com sucesso!' && alert}
					<br>
					<Alert color="green">
						<span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
						</span>
						<span class="font-small">{resp.message}</span>
					</Alert>
				{/if}
				<br>
				{#if loading}
					<div class="text-center"><Spinner/></div>
					<br>
				{/if}
				<Button gradient color="greenToBlue" on:click={updateUser(name, email, selected)} >Salvar alterações</Button>
				<br><br>
				<Button gradient color="redToYellow" >Desativar conta</Button>
			</section>
		</article>
	</div>

	<div id="container">
		<article class="article group" style="padding: 40px !important;">
			<div class="grid items-center md:grid-cols-2" >
				<h5 class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Editar dados de cartão de crédito</h5>
				<div style="width: 100%; position: relative;">
					<img style="cursor: pointer !important; width: 120px; float: right !important;" on:click={() => defaultModal = true} class="upload card" src={addImg} alt="" />
				</div>
			</div>
			<br>

			{#each cards as card, index}
				<article class="article group" style="margin: 0 !important;" >
					<div class="grid gap-6 mb-6 md:grid-cols-2" >
						<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Cartão {index+1}</h5>
						<Label>
							<span>Tipo do cartão</span>
							<Select class="mt-3" items={card_type} bind:value={card.main} />
						</Label>
					</div>
					<br>
					<Label class="space-y-2">
						<span>Nome do cartão</span>
						<Input bind:value={card.name_card} type="text" placeholder="Nome do cartão" size="lg" />
					</Label>
					<br>
					<Label class="space-y-2">
						<span>Número do cartão</span>
						<Input bind:value={card.number} type="text" placeholder="Número do cartão" size="lg" />
					</Label>
					<br>
					<div class="grid gap-6 mb-6 md:grid-cols-2" >
						<Label class="space-y-2">
							<span>Data de validade</span>
							<Input bind:value={card.expiration_date} type="text" placeholder="00/00" size="lg" />
						</Label>
						<Label class="space-y-2">
							<span>CVV</span>
							<Input bind:value={card.cvv} type="text" placeholder="CVV" size="lg" />
						</Label>
						<Label class="space-y-2">
							<span>CPF</span>
							<Input bind:value={card.cpf} type="text" placeholder="CPF" size="lg" />
						</Label>
						<Label class="space-y-2">
							<span>Titular do cartão</span>
							<Input bind:value={card.cardholder} type="text" placeholder="Titular do cartão" size="lg" />
						</Label>
					</div>
					<div class="grid gap-6 mb-6 md:grid-cols-2" >
						<Button gradient color="greenToBlue" on:click={updateCard(card._id, card.number, card.cvv, card.cardholder, card.cpf, card.name_card, card.expiration_date, card.main)} >Salvar alterações</Button>
						<Button gradient color="redToYellow" on:click={deleteCard(card._id)} >Excluir</Button>
					</div>
				</article>
				<br>
			{/each}
		</article>
	</div>

	<div id="container">
		<article class="article group" style="padding: 40px !important;">
			<div class="grid items-center md:grid-cols-2" >
				<h5 class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Editar dados de endereço</h5>
				<div style="width: 100%; position: relative;">
					<img style="cursor: pointer !important; width: 120px; float: right !important;" on:click={() => defaultModalAddress = true}  class="upload card" src={addImg} alt="" />
				</div>
			</div>
			<br>
			{#each address as ad, index}
				<article class="article group" style="margin: 0 !important;" >
					<div class="grid gap-6 mb-6 md:grid-cols-2" >
						<Label class="space-y-2">
							<span>Nome do Endereço</span>
							<Input bind:value={ad.name_a} type="text" placeholder="Nome do Endereço" size="lg" />
						</Label>
						<Label>
							<span>Tipo do endereço</span>
							<Select class="mt-3" items={ad.address_type} bind:value={ad.main} />
						</Label>
					</div>
					
					<br>
					<Label class="space-y-2">
						<span>Rua</span>
						<Input bind:value={ad.road} type="text" placeholder="Rua" size="lg" />
					</Label>
					<br>
					<div class="grid gap-6 mb-6 md:grid-cols-2" >
						<Label class="space-y-2">
							<span>CEP</span>
							<Input bind:value={ad.cep} type="text" placeholder="CEP" size="lg" />
						</Label>
						<Label class="space-y-2">
							<span>Cidade</span>
							<Input bind:value={ad.city} type="text" placeholder="Cidade" size="lg" />
						</Label>
					</div>
					<div class="grid gap-6 mb-6 md:grid-cols-3" >
						<Label class="space-y-2">
							<span>Estado</span>
							<Input bind:value={ad.state} type="text" placeholder="Estado" size="lg" />
						</Label>
						<Label class="space-y-2">
							<span>Número</span>
							<Input bind:value={ad.number} type="text" placeholder="Número" size="lg" />
						</Label>
						<Label class="space-y-2">
							<span>Complemento</span>
							<Input bind:value={ad.complement} type="text" placeholder="Complemento" size="lg" />
						</Label>
					</div>
					{#if loadingmodal}
						<div class="text-center"><Spinner/></div>
						<br>
					{/if}
				</article>
			{/each}
		</article>
	</div>

	<Modal title="Cadastrar novo endereço" bind:open={defaultModalAddress}>
		<article class="article group" style="margin: 0 !important;" >
			<div class="grid gap-6 mb-6 md:grid-cols-2" >
				<Label class="space-y-2">
					<span>Nome do Endereço</span>
					<Input bind:value={name_a} type="text" placeholder="Nome do Endereço" size="lg" />
				</Label>
				<Label>
					<span>Tipo do endereço</span>
					<Select class="mt-3" items={address_type} bind:value={main_a} />
				</Label>
			</div>
			
			<br>
			<Label class="space-y-2">
				<span>Rua</span>
				<Input bind:value={road} type="text" placeholder="Rua" size="lg" />
			</Label>
			<br>
			<div class="grid gap-6 mb-6 md:grid-cols-2" >
				<Label class="space-y-2">
					<span>CEP</span>
					<Input bind:value={cep} type="text" placeholder="CEP" size="lg" />
				</Label>
				<Label class="space-y-2">
					<span>Cidade</span>
					<Input bind:value={city} type="text" placeholder="Cidade" size="lg" />
				</Label>
			</div>
			<div class="grid gap-6 mb-6 md:grid-cols-3" >
				<Label class="space-y-2">
					<span>Estado</span>
					<Input bind:value={state} type="text" placeholder="Estado" size="lg" />
				</Label>
				<Label class="space-y-2">
					<span>Número</span>
					<Input bind:value={number_a} type="text" placeholder="Número" size="lg" />
				</Label>
				<Label class="space-y-2">
					<span>Complemento</span>
					<Input bind:value={complement} type="text" placeholder="Complemento" size="lg" />
				</Label>
			</div>
			{#if loadingmodal}
				<div class="text-center"><Spinner/></div>
				<br>
			{/if}
			<Button gradient color="greenToBlue" on:click={saveNewCard(email, number, cvv, cardholder, cpf, name_card, expiration_date)} >Cadastrar</Button>
		</article>
	</Modal>

	<Modal title="Cadastrar novo cartão" bind:open={defaultModal}>
		<article class="article group" style="margin: 0 !important;" >
			<div class="grid gap-6 mb-6 md:grid-cols-2" >
				<Label class="space-y-2">
					<span>Nome do cartão</span>
					<Input bind:value={name_card} type="text" placeholder="Nome do cartão" size="lg" />
				</Label>
				<Label>
					<span>Tipo do cartão</span>
					<Select class="mt-3" items={card_type} bind:value={main} />
				</Label>
			</div>
			
			<br>
			<Label class="space-y-2">
				<span>Número do cartão</span>
				<Input bind:value={number} type="text" placeholder="Número do cartão" size="lg" />
			</Label>
			<br>
			<div class="grid gap-6 mb-6 md:grid-cols-2" >
				<Label class="space-y-2">
					<span>Data de validade</span>
					<Input bind:value={expiration_date} type="text" placeholder="00/00" size="lg" />
				</Label>
				<Label class="space-y-2">
					<span>CVV</span>
					<Input bind:value={cvv} type="text" placeholder="CVV" size="lg" />
				</Label>
			</div>
			<div class="grid gap-6 mb-6 md:grid-cols-2" >
				<Label class="space-y-2">
					<span>CPF</span>
					<Input bind:value={cpf} type="text" placeholder="CPF" size="lg" />
				</Label>
				<Label class="space-y-2">
					<span>Titular do cartão</span>
					<Input bind:value={cardholder} type="text" placeholder="Titular do cartão" size="lg" />
				</Label>
			</div>
			{#if loadingmodal}
				<div class="text-center"><Spinner/></div>
				<br>
			{/if}
			<Button gradient color="greenToBlue" on:click={saveNewCard(email, number, cvv, cardholder, cpf, name_card, expiration_date)} >Cadastrar</Button>
		</article>
	</Modal>
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
