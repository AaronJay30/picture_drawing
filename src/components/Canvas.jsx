import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios"; // Import Axios for API calls
import "../index.css";
import Swal from "sweetalert2";

const Modal = ({ message, onClose, gifSrc }) => {
	const handleNoHover = (e) => {
		e.target.style.opacity = 0;
	};

	const handleNoMouseLeave = (e) => {
		e.target.style.opacity = 1;
	};

	const handleYesClick = () => {
		Swal.fire({
			title: "Yay! Wala nang bawian!",
			text: "Thank you babi for accepting my offer to be my valentines! ❤️, I love you so much! Pag akyat ko diyan date tayo mwaa! 😘",
			icon: "success",
			confirmButtonText: "Aww, thanks! 💕",
			width: 600,
			padding: "3em",
			color: "#FF69B4", // Soft pink color
			background: "#fff url(https://sweetalert2.github.io/images/flowers.png)", // Flower background
			backdrop: `
				rgba(255,182,193,0.4)
				url("https://sweetalert2.github.io/images/nyan-cat.gif")
				left top
				no-repeat
			`,
			showClass: {
				popup: "animate__animated animate__bounceIn",
			},
			hideClass: {
				popup: "animate__animated animate__bounceOut",
			},
		});
		onClose();
	};

	return (
		<div
			className="modal-overlay"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 1000,
			}}
		>
			<div
				className="modal-content"
				style={{
					backgroundColor: "white",
					borderRadius: "10px",
					padding: "20px",
					maxWidth: "500px",
					width: "100%",
					textAlign: "center",
				}}
			>
				<div className="modal-header" style={{ marginBottom: "20px" }}>
					<h2>Congratulations!</h2>
					<button
						className="close-button"
						onClick={onClose}
						style={{
							fontSize: "20px",
							background: "none",
							border: "none",
							cursor: "pointer",
						}}
					>
						&times;
					</button>
				</div>
				<div className="modal-body" style={{ marginBottom: "20px" }}>
					{gifSrc && (
						<img
							src={gifSrc}
							alt="Celebration GIF"
							className="modal-gif"
							style={{ width: "100%", height: "auto", marginBottom: "20px" }}
						/>
					)}
					<p className="modal-message" style={{ fontSize: "1.5em" }}>
						{message}
					</p>
				</div>
				<div
					className="modal-footer"
					style={{ display: "flex", justifyContent: "center", gap: "10px" }}
				>
					{gifSrc ? (
						<>
							<button
								className="primary-button yes-btn"
								onClick={handleYesClick}
								style={{
									backgroundColor: "#4CAF50",
									color: "white",
									padding: "10px 20px",
									border: "none",
									borderRadius: "5px",
									cursor: "pointer",
								}}
							>
								Yes
							</button>
							<button
								className="primary-button no-btn"
								onMouseEnter={handleNoHover}
								onMouseLeave={handleNoMouseLeave}
								style={{
									backgroundColor: "#f44336",
									color: "white",
									padding: "10px 20px",
									border: "none",
									borderRadius: "5px",
									cursor: "pointer",
								}}
							>
								No
							</button>
						</>
					) : (
						<button
							className="primary-button"
							onClick={onClose}
							style={{
								backgroundColor: "#4CAF50",
								color: "white",
								padding: "10px 20px",
								border: "none",
								borderRadius: "5px",
								cursor: "pointer",
							}}
						>
							Close
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	message: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	gifSrc: PropTypes.string, // Optional prop for GIF source
};
Modal.propTypes = {
	message: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	gifSrc: PropTypes.string, // Optional prop for GIF source
};

Modal.propTypes = {
	message: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	gifSrc: PropTypes.string, // Optional prop for GIF source
};

const Canvas = () => {
	const canvasRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [preloadedImages, setPreloadedImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [hintVisible, setHintVisible] = useState(true);
	const [drawnShapes, setDrawnShapes] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [identifiedShape, setIdentifiedShape] = useState("");
	const [messageModal, setMessageModal] = useState("");
	const [score, setScore] = useState(0); // Track the number of shapes completed
	const [completedShapes, setCompletedShapes] = useState([]); // Changed to array for rendering
	const [finalModal, setFinalModal] = useState(true); // Show the final sweet modal when all shapes are completed

	const audioRef = useRef(null); // Reference for the audio element

	const images = [
		"/assets/scaled_imageBrush1.png",
		"/assets/scaled_imageBrush2.png",
		"/assets/scaled_imageBrush3.png",
		"/assets/scaled_imageBrush4.png",
		"/assets/scaled_imageBrush5.png",
		"/assets/scaled_imageBrush6.png",
		"/assets/scaled_imageBrush7.png",
		"/assets/scaled_imageBrush8.png",
		"/assets/scaled_imageBrush9.png",
	];

	useEffect(() => {
		const loadedImages = images.map((src) => {
			const img = new Image();
			img.src = src;
			return img;
		});

		let loadedCount = 0;
		loadedImages.forEach((img) => {
			img.onload = () => {
				loadedCount += 1;
				if (loadedCount === loadedImages.length) {
					setPreloadedImages(loadedImages);
					setTimeout(() => {
						setLoading(false);
						audioRef.current?.play();
					}, 6000);
				}
			};
		});
	}, []);

	useEffect(() => {
		const audio = audioRef.current;
		if (audio) {
			audio.volume = 0;
			audio.muted = false;
			audio.play().catch((error) => {
				console.error("Error playing audio:", error);
			});

			const fadeIn = setInterval(() => {
				if (audio.volume < 1) {
					audio.volume = Math.min(audio.volume + 0.1, 1);
				} else {
					clearInterval(fadeIn);
				}
			}, 200); // Increase volume every 200ms

			return () => {
				clearInterval(fadeIn);
			};
		}
	}, [loading]);

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setDrawnShapes([{ x: e.clientX, y: e.clientY }]);
		hintVisible && setHintVisible(false);
	};

	const handleMouseUp = async () => {
		setIsDragging(false);
		await identifyShape(drawnShapes);
	};

	let lastImageTimestamp = Date.now();
	const handleMouseMove = (e) => {
		if (!isDragging) return;

		const now = Date.now();
		if (now - lastImageTimestamp < 40) return;

		lastImageTimestamp = now;

		const canvas = canvasRef.current;
		const randomIndex = Math.floor(Math.random() * preloadedImages.length);
		const img = preloadedImages[randomIndex].cloneNode();
		img.className = "image";
		img.style.position = "absolute";
		img.style.left = `${e.clientX}px`;
		img.style.top = `${e.clientY}px`;
		canvas.appendChild(img);

		const newPoints = [...drawnShapes, { x: e.clientX, y: e.clientY }];
		setDrawnShapes(newPoints);
	};

	const handleShapeCompletion = (shape, message) => {
		// Check if the shape is already completed
		if (!completedShapes.includes(shape)) {
			setCompletedShapes((prevShapes) => [...prevShapes, shape]);
			setScore((prevScore) => prevScore + 1);
		}
		setMessageModal(message);
		setShowModal(true);
	};

	const identifyShape = async (points) => {
		const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // Use the Gemini API key

		const prompt = `${JSON.stringify(
			points
		)} Given these coordinates, determine the geometric shape they form. Assume the first coordinate is the origin (0,0) on a Cartesian plane. Only provide the name of the shape.`;

		try {
			setIsLoading(true); // Show loading modal

			// Call Google's Gemini API
			const response = await axios.post(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
				{
					contents: [
						{
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const shapeData =
				response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
				"Unknown Shape";

			// Clean any unexpected newline characters and normalize the shape name
			const normalizedShape = shapeData.replace(/\n/g, "").toUpperCase();

			setIdentifiedShape(normalizedShape);

			switch (normalizedShape) {
				case "POINT":
					handleShapeCompletion(
						"POINT",
						"Every point of our journey is special with you! ❤️"
					);
					break;
				case "HEART":
					handleShapeCompletion(
						"HEART",
						"You are the heart of my world, my everything! ❤️"
					);
					break;
				case "LINE":
					handleShapeCompletion(
						"LINE",
						"My love for you is straight and true, like a line! 💞"
					);
					break;
				case "CURVE":
					handleShapeCompletion(
						"CURVE",
						"Our love has the most beautiful curve—full of surprises and joy! 🌈"
					);
					break;
				case "PARABOLA":
					handleShapeCompletion(
						"PARABOLA",
						"Our love soars to the heights of a parabola and never comes down! 💫"
					);
					break;
				default:
					setShowModal(false);
					break;
			}
		} catch (error) {
			console.error("Error identifying shape:", error);
			setIdentifiedShape("Error identifying shape");
		} finally {
			setIsLoading(false); // Hide loading modal
		}
	};

	const clearCanvas = () => {
		const canvas = canvasRef.current;
		while (canvas.firstChild) {
			canvas.removeChild(canvas.firstChild);
		}
		setDrawnShapes([]);
		setMessageModal("");
		setShowModal(false);
		setIdentifiedShape(""); // Clear the identified shape
	};

	const handleUnlockMessage = () => {
		if (score === 5) {
			setFinalModal(true);
		}
	};

	if (loading) {
		return (
			<div className="loading-screen">
				<div className="hint-text">
					Find the pattern to unlock the message...
				</div>
				<div className="banter-loader">
					<div className="banter-loader__box"></div>
					<div className="banter-loader__box"></div>
					<div className="banter-loader__box"></div>
					<div className="banter-loader__box"></div>
					<div className="banter-loader__box"></div>
					<div className="banter-loader__box"></div>
					<div className="banter-loader__box"></div>
					<div className="banter-loader__box"></div>
					<div className="banter-loader__box"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="canvas-container">
			<audio
				ref={audioRef}
				src="//assets/bg.mp3"
				muted
				autoPlay
				loop
			/>
			<div
				className="canvas"
				ref={canvasRef}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
			></div>
			<button onClick={clearCanvas} className="clear-button">
				Clear Canvas
			</button>
			{score === 5 && (
				<button
					onClick={handleUnlockMessage}
					className="clear-button"
					style={{ marginRight: "250px", backgroundColor: "green" }}
				>
					Unlock Message
				</button>
			)}
			{hintVisible && (
				<div className="hint-text-main">
					✨ Draw a shape to unlock a special message... ✨
				</div>
			)}
			{isLoading && (
				<div
					className="loading-modal"
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.7)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}
				>
					<div
						style={{
							padding: "30px",
							backgroundColor: "white",
							borderRadius: "12px",
							textAlign: "center",
							boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<div
							style={{
								width: "50px",
								height: "50px",
								border: "5px solid #f3f3f3",
								borderTop: "5px solid #3498db",
								borderRadius: "50%",
								animation: "spin 1s linear infinite",
							}}
						></div>
						<p
							style={{
								marginTop: "20px",
								fontSize: "18px",
								fontWeight: "bold",
								color: "#3498db",
							}}
						>
							Identifying shape...
						</p>
					</div>
				</div>
			)}
			{identifiedShape && (
				<div className="hint-text-main">
					🎨 <strong>Shape Identified:</strong> {identifiedShape}
				</div>
			)}
			<div className="score-text-main">
				🌟 <strong>Score:</strong> {score} / 5
			</div>
			<div className="shape-list">
				<h3>Unlocked Shapes:</h3>
				<ul>
					{["HEART", "POINT", "LINE", "CURVE", "PARABOLA"].map(
						(shape, index) => (
							<li key={index}>
								{index + 1}.{" "}
								{completedShapes.includes(shape)
									? shape
									: "X".repeat(shape.length)}
							</li>
						)
					)}
				</ul>
			</div>
			{showModal && (
				<Modal message={messageModal} onClose={() => setShowModal(false)} />
			)}

			{finalModal && (
				<Modal
					message="Hello my babi! Will you be my Valentine? ❤️"
					onClose={() => setFinalModal(false)}
					gifSrc="/assets/valentine.gif" // Add the path to your GIF here
				/>
			)}
		</div>
	);
};

export default Canvas;
