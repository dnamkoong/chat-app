import './Input.scss';

export default function Input({ className, value, onChange, placeHolder, btnClick, btnText }) {
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
          disabled={!value}
        >
          {btnText}
        </button>
      </form>
    </div>
  )
}