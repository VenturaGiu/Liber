<script>
	import { 
		FloatingLabelInput,
		Helper,
		Button,
		P
	} from '../../node_modules/flowbite-svelte'
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="content img_fundo"></div>
	<div class="content form">
		<div class="vertical_center">
			<div id="exampleWrapper" class="grid gap-3 items-end md:grid-cols-1">
				<FloatingLabelInput style="outlined" id="email" name="floating_outlined" type="text" label="E-mail" />
				<FloatingLabelInput style="outlined" id="password" name="floating_outlined" type="text" label="Senha" />
				<Helper class="pt-2" style="float:right">Esqueceu sua senha? <a href="/" class="text-blue-600 dark:text-blue-500 hover:underline">Clique aqui</a>.</Helper>
				<Button class="bg-azul dark:bg-azul hover:bg-azul_claro dark:hover:bg-azul_claro" >Entrar</Button>
				<Helper class="pt-2" style="float:right">Ainda não tem uma conta?</Helper>
				<Button class="button2">Criar Conta</Button>
			</div>
		</div>
	</div>
</section>

<style type="scss">
	.content{
		width: 50%;
		float: left;
		height: 100vh;
		position: relative;
	}
	.img_fundo{
		background-image: url('../lib/images/fundoLogin.jpg');
		background-repeat: no-repeat;
		background-size: auto;
	}
	.form{
		.vertical_center{
			margin-left: 15px;
		}
	}
	#exampleWrapper{
		width: 20vw;
	}
</style>
