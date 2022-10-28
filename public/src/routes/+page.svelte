<script>
	import { 
		FloatingLabelInput,
		Helper,
		Button,
		Heading, 
	} from '../../node_modules/flowbite-svelte'

	
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div id="" class="grid gap-12 items-end md:grid-cols-1">
		<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">Acesse para gerenciar os dados do Liber!</Heading>
		<div id="exampleWrapper" class="grid gap-3 items-end md:grid-cols-1">
			<FloatingLabelInput style="outlined" id="email" name="floating_outlined" type="text" label="E-mail" />
			<FloatingLabelInput style="outlined" id="password" name="floating_outlined" type="text" label="Senha" />
			<Helper class="pt-2" style="text-align: right;">Esqueceu sua senha? <a href="/" class="text-blue-600 dark:text-blue-500 hover:underline">Clique aqui</a>.</Helper>
			<Button gradient color="cyanToBlue">Entrar</Button>
			<Helper class="pt-2" style="text-align: right;">Ainda não tem uma conta?</Helper>
			<Button outline gradient color="cyanToBlue" href="/register">Criar Conta</Button>
		</div>
	</div>
</section>

<style type="scss">
	
	
</style>
