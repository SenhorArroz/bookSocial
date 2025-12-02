const Fab = () => {
	return (
		<div className="fab fab-flower fixed bottom-8 right-8 z-50">
			{/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
			<div
				tabIndex={0}
				role="button"
				className="btn btn-lg btn-info btn-circle"
			>
				F
			</div>

			{/* Main Action button replaces the original button when FAB is open */}
			<button
				type="button"
				className="fab-main-action btn btn-circle btn-lg btn-success"
			>
				M
			</button>

			{/* buttons that show up when FAB is open */}
			<div className="tooltip tooltip-left" data-tip="Label A">
				<button type="button" className="btn btn-lg btn-circle">
					Login
				</button>
			</div>
			<div className="tooltip tooltip-left" data-tip="Label B">
				<button type="button" className="btn btn-lg btn-circle">
					Feed
				</button>
			</div>
		</div>
	);
};

export default Fab;
