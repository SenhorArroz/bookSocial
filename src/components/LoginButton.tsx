const LoginButton = () => {
	return (
		<div className="fixed bottom-8 right-8 shadow-lg">
			<a
				href="/login"
				className="btn border-none bg-purple-600 text-white hover:bg-purple-700"
			>
				Login
			</a>
		</div>
	);
};

export default LoginButton;
