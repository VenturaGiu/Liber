<script>
	import { requiresLogin } from "./+page";


	requiresLogin()
</script>

<svelte:head>
	<title>Usuários</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<iframe class="iframeGrafico" title="grafico" src="http://localhost:3000/reports/users" frameborder="0"></iframe>
</section>

<style>
	.iframeGrafico{
		width: 100%;
		height: 92.5vh;
	}
</style>
