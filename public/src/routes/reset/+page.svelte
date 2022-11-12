<script type="ts">
	import { 
		FloatingLabelInput,
		Helper,
		Button,
		Heading, 
		Alert,
		Checkbox,
		A,
		P,
	} from '../../../node_modules/flowbite-svelte'
	import Copyright from '../../components/Copyright.svelte';
	import {  
		Img
	} from 'flowbite-svelte'
	import { putData} from '../+page' 
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';
	
	const imgUrl = new URL('../../lib/images/logo_white.png', import.meta.url).href
	
	let password = '', confirm_password = '', token = '';
	interface Resp {
		message: String
	}
	
	/**
	* @type {Object}
	*/
	let resp:Resp = {
		message: '',
	};
	if(browser){
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		token = urlParams.get('token') as string

		if(!token){
			const location = '/';
			goto(location);
		}
	}

	async function resetPass() {
		putData('http://localhost:3000/api/dash_user/changePass', {
			"token": token,
			"password": password,
		}).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			const location = '/'
			if (browser) return await goto(location);
			else throw redirect(302, location);
		});
	}
</script>

<main>
	<div id="img_fundo" class="content">
		<Img src={imgUrl} alt="sample 1" size="max-w-xl" id="img_logo_login" />
		<div class="img_fundo"></div>
	</div>
	<div class="content form">
		<div class="vertical_center">
			<div id="" class="grid gap-12 items-end md:grid-cols-1">
				<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">Cadastre uma nova senha!</Heading>
				<div id="exampleWrapper" class="grid gap-3 items-end md:grid-cols-1" >
					<FloatingLabelInput bind:value={password} style="outlined" id="password" name="floating_outlined" type="password" label="Senha" />
					<FloatingLabelInput bind:value={confirm_password} style="outlined" id="confirm_password" name="floating_outlined" type="password" label="Confirme a Senha" />
					
					{#if resp.message.includes('já cadastrado') || resp.message.includes('preencha todos os campos')}
					<Alert color="yellow">
						<span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
						</span>
						<span class="font-small">{resp.message}</span>
					</Alert>
					{/if}
					
					{#if resp.message.includes('Enviamos um e-mail')}
					<Alert color="green">
						<span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
						</span>
						<span class="font-small">{resp.message}</span>
					</Alert>
					{/if}
					<Button on:click={resetPass} gradient color="cyanToBlue">Alterar Senha</Button>
				</div>
			</div>
		</div>
		<Copyright class="copy_login" />
	</div>
</main>

<style>
	#exampleWrapper{
		margin-bottom: 4%;
	}
</style>