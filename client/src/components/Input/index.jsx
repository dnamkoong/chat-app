export default function Input({ className, value, onChange, placeHolder, active, btnClick, btnText }) {
  return (
    <div className={`input ${className}`}>
      <form>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeHolder}
        />
        <button
          onClick={btnClick}
          disabled={active ? '' : 'active'}
        >
          {btnText}
        </button>
      </form>
    </div>
  )
}