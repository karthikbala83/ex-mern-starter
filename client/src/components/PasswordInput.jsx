import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

// ---------------------------------------------------------------
// A password box with a show/hide eye.
//
// Written once and shared by Login, Signup and ResetPassword. Three
// copies of this markup would drift apart the first time anyone
// changed the icon or the spacing.
//
// Two details that matter more than they look:
//
//  * type="button". A <button> inside a <form> defaults to type="submit",
//    so without this, tapping the eye would SUBMIT the login form.
//
//  * The state is per-component and never leaves it. Revealing a password
//    is a UX affordance, not something to remember — it always starts
//    hidden again on the next page load, which is what you want if a
//    student is on a shared lab machine.
//
// aria-label changes with the state so a screen reader announces
// "Show password" / "Hide password" rather than an unlabelled button.
// ---------------------------------------------------------------
export default function PasswordInput({ value, onChange, placeholder = 'Password', ...rest }) {
  const [shown, setShown] = useState(false);

  return (
    <div className="pw-field">
      <input
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
      <button
        type="button"
        className="pw-toggle"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? 'Hide password' : 'Show password'}
        title={shown ? 'Hide password' : 'Show password'}
      >
        {shown ? <MdVisibilityOff /> : <MdVisibility />}
      </button>
    </div>
  );
}
