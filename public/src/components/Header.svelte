<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, P } from 'flowbite-svelte'
	import { DarkMode } from "flowbite-svelte";
	import { browser } from '$app/environment';
	import { getData, postData } from '../routes/+page';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';
	import logo_icon from '../lib/images/icon.png'

	
	let name = ''
	if(browser){ 
		name = document.cookie.split(';').filter(value => value.includes('user'))[0] === undefined ? '' 
		: document.cookie.split(';').filter(value => value.includes('user'))[0].replace('user=', '').includes('%20') === true 
		? document.cookie.split(';').filter(value => value.includes('user'))[0].replace('user=', '').split('%20')[0]
		: document.cookie.split(';').filter(value => value.includes('user'))[0].replace('user=', '')
	}

	let btnClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 fixed right-5 top-5 z-50"

	async function logout() {
		if(browser) {
			window.sessionStorage.clear()
			const location = '/'
			if (browser) return await goto(location);
			else throw redirect(302, location);
		}
	}

	async function genData() {
		if(browser) {
			return await getData('http://localhost:3000/api/dash_user/generateDataReports');
		}
	}
</script>

<DarkMode {btnClass} />
<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img
		src={logo_icon}
		class="mr-3 h-8 sm:h-12"
		alt="Flowbite Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Liber
		</span>
	</NavBrand>
	<div class="flex md:order-2" style="text-align: center !important;">
		<P style="    
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-right: 15px;" 
		size="lg">{ name }</P>
		<Button on:click={logout} gradient color="cyanToBlue" size="sm">Sair</Button>
		<NavHamburger on:click={toggle} />
	</div>
	<NavUl {hidden} class="order-1">
		<NavLi href="/logged">Usuários</NavLi>
		<NavLi href="/logged/ads">Anúncios</NavLi>
		<NavLi href="/logged/books">Livros</NavLi>
		<NavLi on:click={genData} href="/logged/books">gerar PDF</NavLi>
	</NavUl>
</Navbar>

<style>
</style>
