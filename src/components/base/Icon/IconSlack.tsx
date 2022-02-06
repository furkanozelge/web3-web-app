import * as React from "react";

const IconSlack = ({ fill = "var(--main)", ...props }) => (
	<svg
		width={24}
		height={24}
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		{...props}
	>
		<path
			d="M13.653.004a2.148 2.148 0 0 0-.808.103 1.95 1.95 0 0 0-1.308 2.522l.94 2.905-4.138 1.35-.911-2.789C7.073 3.007 5.883 2.49 4.814 2.834a1.952 1.952 0 0 0-1.306 2.523l.918 2.804-3.065.999C.33 9.507-.244 10.662.1 11.702c.288.87 1.09 1.389 1.893 1.389.23 0 .457-.057.631-.117l3.045-.993 1.225 3.752-3.243 1.061c-1.09.347-1.605 1.504-1.261 2.544.288.87 1.031 1.39 1.89 1.39.172 0 .402-.058.63-.118l3.234-1.042.998 3.056c.297.803 1.13 1.376 1.96 1.376.236 0 .475-.058.654-.115 1.067-.345 1.66-1.492 1.306-2.525l-.998-3.055 4.114-1.328.942 2.92c.297.803 1.127 1.376 1.96 1.376.236 0 .473-.058.651-.115 1.07-.346 1.663-1.492 1.306-2.525l-.942-2.917 2.574-.831c1.031-.405 1.602-1.562 1.203-2.604-.346-1.04-1.491-1.617-2.523-1.27l-2.51.819-1.213-3.75 2.72-.887c1.088-.345 1.606-1.502 1.26-2.542-.344-1.099-1.489-1.619-2.522-1.272l-2.692.88-.935-2.891C15.189.55 14.455.056 13.653.004Zm.06 9.354 1.213 3.752-4.117 1.345-1.225-3.75 4.13-1.347Z"
		/>
	</svg>
);

export default IconSlack;
