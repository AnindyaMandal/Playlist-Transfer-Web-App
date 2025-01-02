"use client";

import React, { useEffect, useRef } from "react";

const SmoothWaveform: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Resize the canvas
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// Wave parameters
		const numPoints = 500; // Smoothness (number of points)
		const amplitude = 300; // Wave height
		const frequency = 0.3; // Wave frequency
		const speed = 0.02; // Animation speed
		const waveLayers = 1; // Multiple layers for depth
		const colors = ["#34d399", "#fde047", "#f43f5e"]; // Green, yellow, red

		let time = 0;

		// Generate a sine wave pattern
		const generateWave = (layerIndex: number) => {
			const points: number[] = [];
			for (let i = 0; i < numPoints; i++) {
				const wave = Math.sin(i * frequency + time + layerIndex); // Smooth sine wave
				const offset = Math.sin(time * 0.2 + layerIndex); // Slow oscillation
				points.push(amplitude * wave * (1 - Math.abs(offset)));
			}
			return points;
		};

		// Draw the waveform
		const drawWaveform = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const centerY = canvas.height / 2;
			const segmentWidth = canvas.width / numPoints;

			for (let layer = 0; layer < waveLayers; layer++) {
				const points = generateWave(layer);

				// Begin drawing
				ctx.beginPath();
				for (let i = 0; i < numPoints; i++) {
					const x = i * segmentWidth;
					const y = centerY + points[i];

					if (i === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}

				// Gradient effect
				const gradient = ctx.createLinearGradient(
					0,
					0,
					canvas.width,
					0
				);
				gradient.addColorStop(0, colors[0]);
				gradient.addColorStop(0.5, colors[1]);
				gradient.addColorStop(1, colors[2]);

				ctx.strokeStyle = gradient;
				ctx.lineWidth = 2;
				ctx.stroke();
			}
		};

		// Animation loop
		const animate = () => {
			time += speed;
			drawWaveform();
			requestAnimationFrame(animate);
		};
		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute top-0 left-0 w-full h-full"
		/>
	);
};

export default SmoothWaveform;
