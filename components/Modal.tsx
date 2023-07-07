import { useRef } from "react"

interface ModalProps {
	children: React.ReactNode
	show: boolean
	setShow: (show: boolean) => void
	title?: string
	className?: string
}

const Modal: React.FC<ModalProps> = ({ children, show, setShow, title, className }) => {
	const boxRef = useRef(null)

	if (!show) return null

	return (
		<div
			onClick={(e) => {
				if (boxRef.current && !boxRef.current.contains(e.target))
					setShow(false)
			}}
			className={`fixed z-200 w-screen h-screen inset-0 bg-black bg-opacity-60 transition-all`}
		>
			<div
				ref={boxRef}
				className={`fixed z-50 justify-items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                rounded-md px-4 py-3 space-y-5 bg-white shadow-lg flex flex-col  ${className}`}
			>

				{!!title && (
					<h1 className="text-2xl text-center font-semibold">{title}</h1>
				)}
				<div className="py-5 border-t border-faint flex flex-col justify-center">
					{children}
				</div>
			</div>
		</div>
	)
}

export default Modal