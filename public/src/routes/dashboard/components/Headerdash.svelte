<script>
// @ts-nocheck

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, P } from 'flowbite-svelte'
	import { DarkMode } from "flowbite-svelte";
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';
	import logo_icon from '../../../lib/images/icon.png'
	
	let name = ''
	if(browser){ 
		name = window.sessionStorage.getItem('name') === undefined ? '' : window.sessionStorage.getItem('name')
	}

	let btnClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 fixed right-5 top-5 z-50"

	async function logout() {
		if(browser) {
			window.sessionStorage.clear()
			const location = '/dashboard'
			if (browser) return await goto(location);
			else throw redirect(302, location);
		}
	}

	async function getPdf(params) {
		
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
	<div class="flex md:order-3" style="text-align: center !important;">
		<div id="container" class="grid items-center md:grid-cols-4" >
			<Button on:click={getPdf} gradient color="purpleToBlue" size="sm">PDF</Button>
			<p></p>
			<P size="xs">{ name }</P>
			<Button on:click={logout} gradient color="cyanToBlue" size="sm">Sair</Button>
			<NavHamburger on:click={toggle} />
		</div>
	</div>
	<NavUl {hidden} class="order-1">
		<NavLi href="/dashboard/logged">Usuários</NavLi>
		<NavLi href="/dashboard/logged/ads">Anúncios</NavLi>
		<NavLi href="/dashboard/logged/books">Livros</NavLi>
	</NavUl>
</Navbar>

<style>
</style>
