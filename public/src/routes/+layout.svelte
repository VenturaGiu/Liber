<script>
	import '../app.postcss';
	import './styles.scss';
	import { DarkMode } from "flowbite-svelte";
	import Copyright from '../components/Copyright.svelte';
	import {  
		Img
	} from '../../node_modules/flowbite-svelte'
	const imgUrl = new URL('../lib/images/logo_white.png', import.meta.url).href
	let btnClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 fixed right-5 top-5 z-50"
</script>
<DarkMode {btnClass} />

<div class="app ">
	<main >
		<div id="img_fundo" class="content">
			<Img src={imgUrl} alt="sample 1" size="max-w-xl" id="img_logo_login" />
			<div class="img_fundo"></div>
		</div>
		<div class="content form">
			<div class="vertical_center">
				<slot />
			</div>
			<Copyright class="copy_login" />
		</div>
	</main>
</div>

<style type="scss" >
	
</style>
