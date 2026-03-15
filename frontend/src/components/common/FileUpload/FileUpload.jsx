import { useRef } from 'react'
import { RiUploadCloud2Line, RiCheckLine } from 'react-icons/ri'

function FileUpload({ label, hint, accept, value, onChange, error, note }) {
    const ref = useRef()

    const handleChange = (e) => {
        if (onChange) onChange(e.target.files[0])
    }

    return (
        <div>
            <div
                onClick={() => ref.current.click()}
                className={`
          border-2 border-dashed rounded-md p-5 text-center cursor-pointer
          transition-all duration-150
          ${value
                        ? 'border-green-300 bg-success-light'
                        : error
                            ? 'border-orange-200 bg-orange-50'
                            : 'border-n300 bg-n50 hover:border-primary hover:bg-primary-light'}
        `}
            >
                <span className="block text-3xl mb-2">
                    {value ? <RiCheckLine size={28} className="text-success mx-auto mb-2" /> : <RiUploadCloud2Line size={28} className="text-n400 mx-auto mb-2" />}
                </span>
                <p className="text-[13px] font-semibold text-n700 mb-1">
                    {value ? value.name : (label || 'Klik untuk upload')}
                </p>
                {hint && !value && (
                    <p className="text-[11px] text-n400">{hint}</p>
                )}
                {value && (
                    <p className="text-[12px] font-semibold text-success mt-1">{value.name}</p>
                )}
            </div>

            {note && (
                <div className="mt-1.5 text-[11.5px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xs px-2.5 py-1.5 leading-snug">
                    {note}
                </div>
            )}

            {error && !note && (
                <p className="mt-1 text-[11px] text-danger">{error}</p>
            )}

            <input
                ref={ref}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleChange}
            />
        </div>
    )
}

export default FileUpload