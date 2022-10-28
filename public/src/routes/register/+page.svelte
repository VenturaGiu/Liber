<script>
    import { 
		FloatingLabelInput,
		Helper,
		Button,
		Heading, 
	} from '../../../node_modules/flowbite-svelte'
</script>

<main>
    <div id="" class="grid gap-12 items-end md:grid-cols-1">
		<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">Crie um conta para gerenciar os dados do Liber!</Heading>
		<div id="exampleWrapper" class="grid gap-3 items-end md:grid-cols-1">
            <FloatingLabelInput style="outlined" id="name" name="floating_outlined" type="text" label="Nome completo" />
			<FloatingLabelInput style="outlined" id="email" name="floating_outlined" type="text" label="E-mail" />
			<FloatingLabelInput style="outlined" id="password" name="floating_outlined" type="text" label="Senha" />
            <FloatingLabelInput style="outlined" id="confir_password" name="floating_outlined" type="text" label="Confirme Senha" />
			<Helper class="pt-2" style="text-align: right;">Já possui uma conta? <a href="/" class="text-blue-600 dark:text-blue-500 hover:underline">Faça login aqui</a>.</Helper>
			<Button outline gradient color="cyanToBlue" href="/register">Criar Conta</Button>
		</div>
	</div>
</main>

<style>

</style>