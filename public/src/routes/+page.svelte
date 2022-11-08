<script type="ts">
	import { 
		FloatingLabelInput,
		Helper,
		Button,
		Heading,
		Alert, 
	} from '../../node_modules/flowbite-svelte'
	import {postData} from './+page' 
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Copyright from '../components/Copyright.svelte';
	import {  
		Img
	} from 'flowbite-svelte'
	const imgUrl = new URL('../lib/images/logo_white.png', import.meta.url).href
	let email = '', password = '';
	interface Resp {
		message: String,
		name: String,
		token: String
	}
	
	/**
	* @type {Object}
	*/
	let resp:Resp = {
		message: '',
		name: '',
		token: '',
	};
	
	async function login() {
		postData('http://localhost:3000/api/dash_user/login', {
			"email": email,
			"password": password,
		}).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			resp = data
			const location = '/logged';
			console.log(resp.token.length)
			if(resp.token.length > 0){
				if (browser) return await goto(location);
				else throw redirect(302, location);
			}
		});
	}
	
</script>

<svelte:head>
<title>Home</title>
<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div id="img_fundo" class="content">
		<Img src={imgUrl} alt="sample 1" size="max-w-xl" id="img_logo_login" />
		<div class="img_fundo"></div>
	</div>
	<div class="content form">
		<div class="vertical_center">
			<div id="" class="grid gap-12 items-end md:grid-cols-1">
				<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">Acesse para gerenciar os dados do Liber!</Heading>
				<div id="exampleWrapper" class="grid gap-3 items-end md:grid-cols-1">
					<FloatingLabelInput bind:value={email} style="outlined" id="email" name="floating_outlined" type="text" label="E-mail" />
					<FloatingLabelInput bind:value={password} style="outlined" id="password" name="floating_outlined" type="password" label="Senha" />
					<Helper class="pt-2" style="text-align: right;">Esqueceu sua senha? <a href="/" class="text-blue-600 dark:text-blue-500 hover:underline">Clique aqui</a>.</Helper>
					
					{#if resp && resp.message && resp.message.includes('já cadastrado') || resp && resp.message && resp.message.includes('preencha todos os campos')}
					<Alert color="yellow">
						<span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
						</span>
						<span class="font-small">{resp.message}</span>
					</Alert>
					{/if}
					
					<Button on:click={login} gradient color="cyanToBlue">Entrar</Button>
					<Helper class="pt-2" style="text-align: right;">Ainda não tem uma conta?</Helper>
					<Button outline gradient color="cyanToBlue" href="/register">Criar Conta</Button>
				</div>
			</div>
		</div>
		<Copyright class="copy_login" />
	</div>
</section>

<style >
	
</style>
