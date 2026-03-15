function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-[460px]',
        lg: 'max-w-[680px]',
        xl: 'max-w-[920px]',
    }

    return (
        <div
            className="fixed inset-0 z-[900] bg-n900/45 backdrop-blur-sm flex items-center justify-center p-5"
            onClick={onClose}
        >
            <div
                className={`
          bg-white rounded-xl p-6 w-full ${sizes[size]}
          shadow-lg max-h-[92vh] overflow-y-auto
          animate-[modalIn_.18s_cubic-bezier(.34,1.56,.64,1)]
        `}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-n200">
                    <h3 className="text-[14px] font-bold font-poppins">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-[26px] h-[26px] rounded-xs bg-n100 border border-n200 text-n500 flex items-center justify-center cursor-pointer hover:bg-n200 text-base leading-none"
                    >
                        ×
                    </button>
                </div>

                <div>{children}</div>
            </div>
        </div>
    )
}

export default Modal