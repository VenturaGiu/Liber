<script>
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { A, Heading } from "flowbite-svelte";
	import { getData } from "../../+page";
	import logo_icon from "../../lib/images/icon.png"
	
	if(browser){
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const token = urlParams.get('token')

		getData(`http://localhost:3000/api/dash_user/validate?token=${token}`).then(async (data) => {
			console.log(data); // JSON data parsed by `data.json()` call
			const location = '/';
			return await goto(location);
		});
	}
</script>

<svelte:head>
<title>Home</title>
<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="justify">
		<div class="justify_items">
			<center>
			<div class="grid gap-3 items-end md:grid-cols-1">
					<img 
					src={logo_icon} 
					alt="Liber Logo"
					style="width: 16%; height: auto; margin: 0 auto;"
					/>
					<br>
					<Heading tag="h1" class="mb-5" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">E-mail verificado com sucesso!</Heading>
					<p class="text-4xl dark:text-white"><A textColor="text-blue-600 dark:text-blue-500" href="/" >Clique aqui para ser redirecionado a tela de login :)</A></p>
					<p class="text-xl dark:text-white">Equipe liber.</p>
				</div>
			</center>
		</div>
	</div>
</section>

<style>
	.justify{
		height: 100vh;
		align-items: center;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}
	.justify_items{
		margin: auto;
		width: 100vw;
	}
</style>
