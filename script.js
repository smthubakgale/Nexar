// Get the canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define the components
class Component {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 50;
		this.height = 20;
		this.selected = false;
	}
	
	draw(ctx) {}
	
	isHit(x, y) {
		return (
			x >= this.x &&
			x <= this.x + this.width &&
			y >= this.y &&
			y <= this.y + this.height
		);
	}
}

class Resistor extends Component {
	draw(ctx) {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = 'black';
		ctx.fill();
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = 'white';
		ctx.font = '12px Arial';
		ctx.fillText('1000Ω', this.x + this.width / 2, this.y + this.height / 2);
	}
}

class VoltageSource extends Component {
	draw(ctx) {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = 'white';
		ctx.font = '12px Arial';
		ctx.fillText('12V', this.x + this.width / 2, this.y + this.height / 2);
	}
}

class Wire {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
	
	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
}

// Create an array to hold the components
const components = [];

// Create an array to hold the wires
const wires = [];

// Draw the components and wires
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	components.forEach(component => component.draw(ctx));
	wires.forEach(wire => wire.draw(ctx));
}

// Add event listeners for drag and drop
const resistor = document.querySelector('.resistor');
const voltageSource = document.querySelector('.voltage-source');

resistor.addEventListener('dragstart', event => {
	event.dataTransfer.setData('text', 'resistor');
});

voltageSource.addEventListener('dragstart', event => {
	event.dataTransfer.setData('text', 'voltageSource');
});

canvas.addEventListener('dragover', event => {
	event.preventDefault();
});

canvas.addEventListener('drop', event => {
	const componentName = event.dataTransfer.getData('text');
	const x = event.clientX - canvas.offsetLeft;
	const y = event.clientY - canvas.offsetTop;
	
	if (componentName === 'resistor') {
		const resistor = new Resistor(x, y);
		components.push(resistor);
	} else if (componentName === 'voltageSource') {
		const voltageSource = new VoltageSource(x, y);
		components.push(voltageSource);
	}
	
	draw();
});

canvas.addEventListener('mousedown', event => {
	const x = event.clientX - canvas.offsetLeft;
	const y = event.clientY - canvas.offsetTop;
	
	// Check if a component was clicked
	components.forEach(component => {
		if (component.isHit(x, y)) {
			component.selected = true;
		}
	});
});

canvas.addEventListener('mousemove', event => {
	const x = event.clientX - canvas.offsetLeft;
	const y = event.clientY - canvas.offsetTop;
	
	// Move the selected component
	components.forEach(component => {
		if (component.selected) {
			component.x = x - component.width / 2;
			component.y = y - component.height / 2;
			draw();
		}
	});
});

canvas.addEventListener('mouseup', event => {
	const x = event.clientX - canvas.offsetLeft;
	const y = event.clientY - canvas.offsetTop;
	
	// Deselect the component
	components.forEach(component => {
		component.selected = false;
	});
});
