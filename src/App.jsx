import React, { useRef, useState } from 'react';
import './App.css';
import logo from './logo.png';
import salad from './salad.png';
import topVector from './Vector.png';

function App() {
  // 'auth' لصفحة Connexion / Inscription، و 'reset' لمسار استعادة كلمة المرور
  const [screenMode, setScreenMode] = useState('auth');
  // خطوات استعادة كلمة المرور: 'email' | 'code' | 'password' | 'done'
  const [resetStep, setResetStep] = useState('email');

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // منع تعبئة المتصفح التلقائية لكلمات المرور عند الفتح
  const [unlockNewPass, setUnlockNewPass] = useState(false);
  const [unlockConfirmNewPass, setUnlockConfirmNewPass] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetEmail, setResetEmail] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [resentNotice, setResentNotice] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const codeInputsRef = useRef([]);

  const openForgotPassword = () => {
    setResetEmail(email || '');
    setCodeDigits(['', '', '', '', '', '']);
    setCodeError('');
    setResentNotice(false);
    setPasswordError('');
    setNewPassword('');
    setConfirmNewPassword('');
    setUnlockNewPass(false);
    setUnlockConfirmNewPass(false);
    setResetStep('email');
    setScreenMode('reset');
  };

  const backToLogin = () => {
    setIsLogin(true);
    setScreenMode('auth');
  };

  const handleSendResetLink = (e) => {
    e.preventDefault();
    setCodeDigits(['', '', '', '', '', '']);
    setCodeError('');
    setResentNotice(false);
    setResetStep('code');
  };

  const handleCodeChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const updated = [...codeDigits];
    updated[index] = cleaned;
    setCodeDigits(updated);
    setCodeError('');

    if (cleaned && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i += 1) {
      next[i] = pasted[i];
    }
    setCodeDigits(next);
    setCodeError('');
    const focusIndex = Math.min(pasted.length, 5);
    codeInputsRef.current[focusIndex]?.focus();
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    const joined = codeDigits.join('');
    if (joined.length < 6) {
      setCodeError('Veuillez saisir le code à 6 chiffres.');
      return;
    }
    setCodeError('');
    setNewPassword('');
    setConfirmNewPassword('');
    setUnlockNewPass(false);
    setUnlockConfirmNewPass(false);
    setResetStep('password');
  };

  const handleResendCode = (e) => {
    e.preventDefault();
    setCodeDigits(['', '', '', '', '', '']);
    setCodeError('');
    setResentNotice(true);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmNewPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    setPasswordError('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetStep('done');
  };

  return (
    <div className="page-wrapper">
      {/* الرسمة الجانبية العلوية */}
      <img src={topVector} alt="" className="top-vector-img" />

      {screenMode === 'auth' ? (
        <>
          {/* القسم الأيسر: اللوجو والنصوص وتصميم السلطة */}
          <div className="left-section">
            <div className="brand-content">
              <img src={logo} alt="MiamPlan Logo" className="brand-logo" />
              <h1 className="main-heading">
                Créez facilement<br />votre menu de semaine !
              </h1>
              <p className="sub-heading">
                Créez vos menu, planifiez vos repas<br />
                pour la semaine et simplifiez votre quotidien.
              </p>
            </div>

            <div className="salad-container">
              <img src={salad} alt="Salad dish" className="salad-img" />
            </div>
          </div>

          {/* القسم الأيمن: البطاقة البيضاء */}
          <div className="right-section">
            <div className="auth-card">
              <div className="tabs-container">
                <button
                  type="button"
                  className={`tab-btn ${isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(true)}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  className={`tab-btn ${!isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(false)}
                >
                  Inscription
                </button>
              </div>

              {isLogin ? (
                <div className="form-content">
                  <div className="card-header">
                    <h2 className="card-title">Bon Retour !</h2>
                    <p className="card-subtitle">Connectez-vous pour accéder à votre espace.</p>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                    <div className="form-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="email"
                          name="login_email_field"
                          autoComplete="off"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Adresse e-mail"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="login_pass_field"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Mot de passe"
                          className="form-input"
                        />
                        <button
                          type="button"
                          className="eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="form-options">
                      <label className="remember-label">
                        <input type="checkbox" /> Se souvenir de moi
                      </label>
                      <button
                        type="button"
                        className="forgot-link-btn"
                        onClick={openForgotPassword}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>

                    <button type="submit" className="submit-btn">
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Se connecter
                    </button>
                  </form>

                  <div className="divider">Ou</div>

                  <button type="button" className="google-btn">
                    <svg className="google-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.17 21.32 7.23 24 12 24z" />
                      <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.85 0 12s.43 3.88 1.18 5.4l4.09-3.16z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                    </svg>
                    Continuer avec Google
                  </button>

                  <div className="card-footer">
                    Vous n'avez pas de compte ?{' '}
                    <span className="signup-link" onClick={() => setIsLogin(false)}>
                      Inscrivez-vous
                    </span>
                  </div>
                </div>
              ) : (
                <div className="form-content">
                  <div className="card-header">
                    <h2 className="card-title">Bienvenue !</h2>
                    <p className="card-subtitle">Créez votre compte pour planifier vos repas</p>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                    <div className="form-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input
                          type="text"
                          name="signup_name_field"
                          autoComplete="off"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nom et Prénom"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="email"
                          name="signup_email_field"
                          autoComplete="off"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Adresse e-mail"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="signup_pass_field"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Mot de passe"
                          className="form-input"
                        />
                        <button
                          type="button"
                          className="eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="input-wrapper">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="signup_confirm_pass_field"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmer le mot de passe"
                          className="form-input"
                        />
                        <button
                          type="button"
                          className="eye-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>
                      Créer mon compte
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </form>

                  <div className="card-footer">
                    Vous avez déjà un compte ?{' '}
                    <span className="signup-link" onClick={() => setIsLogin(true)}>
                      Connectez-vous
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* مسار استعادة كلمة المرور (3 خطوات) */
        <div className="reset-wrapper">
          <div className="salad-container">
            <img src={salad} alt="Salad dish" className="salad-img" />
          </div>

          <div className="reset-card">
            <img src={logo} alt="MiamPlan Logo" className="reset-logo" />

            {/* 1. Mot de passe oublié ? */}
            {resetStep === 'email' && (
              <>
                <h2 className="reset-title">Mot de passe oublié ?</h2>
                <p className="reset-subtitle">
                  Saisissez votre adresse e-mail.<br />
                  Nous vous enverrons un lien pour<br />
                  réinitialiser votre mot de passe
                </p>

                <form onSubmit={handleSendResetLink} autoComplete="off">
                  <div className="reset-input-box">
                    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="exemple@@gmail.com"
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="reset-primary-btn">
                    Envoyer le lien
                  </button>
                </form>

                <button type="button" className="reset-back-link" onClick={backToLogin}>
                  ← Retour
                </button>
              </>
            )}

            {/* 2. Vérifier votre email (كود من 6 أرقام) */}
            {resetStep === 'code' && (
              <>
                <h2 className="reset-title">Vérifier votre email</h2>
                <p className="reset-subtitle">
                  Nous avons envoyé un code de 6 chiffres à<br />
                  <strong>{resetEmail || 'exemple@gmail.com'}</strong>. Saisissez-le ci-dessous
                </p>

                <form onSubmit={handleVerifyCode} autoComplete="off">
                  <div className="otp-container" onPaste={handleCodePaste}>
                    {codeDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          codeInputsRef.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(idx, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                        className="otp-box"
                      />
                    ))}
                  </div>

                  {codeError && <p className="reset-error">{codeError}</p>}
                  {resentNotice && (
                    <p className="reset-info">Un nouveau code a été envoyé.</p>
                  )}

                  <button type="submit" className="reset-primary-btn">
                    Vérifier le code
                  </button>
                </form>

                <div className="resend-row">
                  Vous n'avez rien reçu ?{' '}
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={handleResendCode}
                  >
                    Renvoyer le code
                  </button>
                </div>

                <button
                  type="button"
                  className="reset-back-link"
                  onClick={() => setResetStep('email')}
                >
                  ← Modifier l'adresse e-mail
                </button>
              </>
            )}

            {/* 3. Nouveau mot de passe */}
            {resetStep === 'password' && (
              <>
                <h2 className="reset-title">Nouveau mot de passe</h2>
                <p className="reset-subtitle">
                  Choisissez un mot de passe sécurisé<br />
                  que vous n'utilisez pas ailleurs.
                </p>

                <form onSubmit={handleResetPasswordSubmit} autoComplete="off">
                  <div className="reset-input-box" style={{ marginBottom: '0.85rem' }}>
                    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="mp_reset_new_secret"
                      autoComplete="off"
                      readOnly={!unlockNewPass}
                      onFocus={() => setUnlockNewPass(true)}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => {
                        setUnlockNewPass(true);
                        setShowNewPassword(!showNewPassword);
                      }}
                    >
                      <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>

                  <div className="reset-input-box">
                    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      name="mp_reset_confirm_secret"
                      autoComplete="off"
                      readOnly={!unlockConfirmNewPass}
                      onFocus={() => setUnlockConfirmNewPass(true)}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirmer le mot de passe"
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => {
                        setUnlockConfirmNewPass(true);
                        setShowConfirmNewPassword(!showConfirmNewPassword);
                      }}
                    >
                      <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>

                  {passwordError && <p className="reset-error">{passwordError}</p>}

                  <button type="submit" className="reset-primary-btn reset-wide-btn">
                    Réinitialiser le mot de passe
                  </button>
                </form>
              </>
            )}

            {/* 4. تم التغيير بنجاح */}
            {resetStep === 'done' && (
              <>
                <h2 className="reset-title">Mot de passe réinitialisé !</h2>
                <p className="reset-subtitle">
                  Votre mot de passe a été mis à jour avec succès.<br />
                  Vous pouvez maintenant vous connecter.
                </p>
                <button type="button" className="reset-primary-btn" onClick={backToLogin}>
                  Se connecter
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;