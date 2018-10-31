(function(){
	'use strict'
	
	console.log('Hello from script.js ');

	const hamburger = document.getElementById('hamburger');
	const menuList = document.getElementById('navbar-menu');


	const toggleMenu = function(){
		hamburger.classList.toggle('active');
		menuList.classList.toggle('active');
	}

	hamburger.addEventListener('click', function() {
		toggleMenu();
	})


})()