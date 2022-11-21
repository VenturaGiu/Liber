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
		Spinner,
	} from '../../../node_modules/flowbite-svelte'
	import Copyright from '../../components/Copyright.svelte';
	import {  
		Img
	} from 'flowbite-svelte'
	import {postData} from '../+page' 
	
	const imgUrl = new URL('../../lib/images/logo_white.png', import.meta.url).href
	
	let name = '', email = '', password = '', confirm_password= '', loading = false;
	interface Resp {
		message: String
	}
	
	/**
	* @type {Object}
	*/
	let resp:Resp = {
		message: '',
	};
	function register() {
		loading = true
		postData('http://localhost:3000/api/app_user/', {
			"name": name,
			"email": email,
			"password": password,
			"confirmPass": confirm_password
		}).then((data) => {
			loading = false
			resp = data
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
				<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">Crie um conta para accessar o Liber!</Heading>
				<div id="exampleWrapper" class="grid gap-3 items-end md:grid-cols-1" >
					<FloatingLabelInput bind:value={name} style="outlined" id="name" name="floating_outlined" type="text" label="Nome completo" />
					<FloatingLabelInput bind:value={email} style="outlined" id="email" name="floating_outlined" type="text" label="E-mail" />
					<FloatingLabelInput bind:value={password} style="outlined" id="password" name="floating_outlined" type="password" label="Senha" />
					<FloatingLabelInput bind:value={confirm_password} style="outlined" id="confirm_password" name="floating_outlined" type="password" label="Confirme a Senha" />
					<Checkbox class="space-x-1 flex_contet" required><P size="sm" align="right" >Eu concordo com os <A href="/"> termos e condições</A>.</P></Checkbox>
					
					{#if resp.message.includes('já cadastrado') || resp.message.includes('preencha todos os campos')}
					<Alert color="yellow">
						<span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
						</span>
						<span class="font-small">{resp.message}</span>
					</Alert>
					{/if}
					
					{#if loading}
						<div class="text-center"><Spinner/></div>
					{/if}

					{#if resp.message.includes('Enviamos um e-mail')}
					<Alert color="green">
						<span slot="icon"><svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
						</span>
						<span class="font-small">{resp.message}</span>
					</Alert>
					{/if}
					<Button on:click={register} outline gradient color="cyanToBlue" href="/register">Criar Conta</Button>
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