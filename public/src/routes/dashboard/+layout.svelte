<script>
	import '../styles.scss';

	import { DarkMode } from "flowbite-svelte";

	let btnClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 fixed right-5 top-5 z-50"
</script>

<div class="app ">
	<DarkMode {btnClass} />
	<main >
		<slot />
	</main>
</div>

<style type="scss" >
	*{
		overflow-y: hidden !important;
	}
</style>
