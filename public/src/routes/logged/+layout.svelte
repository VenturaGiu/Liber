<script>
	import Copyright from '../../../src/components/Copyright.svelte';
	import Header from '../../../src/components/Header.svelte';

</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
	</footer>
	<Copyright />
</div>

<style>
	
</style>
