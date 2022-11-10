<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, P } from 'flowbite-svelte'
	import { DarkMode } from "flowbite-svelte";
	import { browser } from '$app/environment';
	import { getData } from '../routes/+page';
	
	let name = ''
	if(browser){ 
		name = document.cookie.split(';').filter(value => value.includes('user'))[0] === undefined ? '' : document.cookie.split(';').filter(value => value.includes('user'))[0].replace('user=', '')
	}

	let btnClass = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 fixed right-5 top-5 z-50"

	async function logout() {
		if(browser) {
			window.sessionStorage.clear()
		}
	}

</script>

<DarkMode {btnClass} />
<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img
		src="https://flowbite.com/docs/images/logo.svg"
		class="mr-3 h-6 sm:h-9"
		alt="Flowbite Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Flowbite
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
		<NavLi href="/" active={true}>Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/services">Services</NavLi>
		<NavLi href="/pricing">Pricing</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>
</Navbar>

<style>
</style>
