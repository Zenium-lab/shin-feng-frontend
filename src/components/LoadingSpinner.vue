<template>
	<div class="loading">
		<img class="loading-logo" src="images/logo.png" alt="新光保全" />
	</div>
</template>

<style>
.loading {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0); /* 添加半透明的背景顏色 */
}

.loading-logo {
	width: 80px; /* 設定合適的尺寸 */
	height: auto;
	animation: rotate 2s linear infinite;
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
