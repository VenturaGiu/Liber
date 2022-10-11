<script lang="ts">
	import Botao from "./components/Botao.svelte";
	import Router from "svelte-spa-router"
	import Home from "./routes/Home.svelte"
	import About from "./routes/About.svelte";
	
	let routes = {
		"/": Home,
		"/about/:teste": About
	}
</script>

<nav>
	<a href="#/" >Home</a>
	<a href="#/about/teste" >About</a>
</nav>
<main>
	<Router {routes}/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>