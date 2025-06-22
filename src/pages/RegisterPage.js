"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPages.css";

const RegisterPage = () => {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }

    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    // Enhanced Email Validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      errors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }

    // Enhanced Password Validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(
        formData.password
      )
    ) {
      errors.password =
        "Password must contain at least one uppercase, one lowercase, one number, and one special character";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields before validation
    const requiredFields = [
      "name",
      "email",
      "phone",
      "password",
      "confirmPassword",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field].trim()
    );

    if (emptyFields.length > 0) {
      alert("400 Bad Request ! Please fill all the fields!");
      return;
    }

    if (validateForm()) {
      try {
        setIsSubmitting(true);
        await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        navigate("/");
      } catch (err) {
        console.error("Registration failed:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h1 className="auth-title">Register</h1>
          <p className="auth-subtitle">Create your account to book tickets</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${formErrors.name ? "error" : ""}`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
              {formErrors.name && (
                <div className="form-error">{formErrors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${formErrors.email ? "error" : ""}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <div className="form-error">{formErrors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-control ${formErrors.phone ? "error" : ""}`}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
              {formErrors.phone && (
                <div className="form-error">{formErrors.phone}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${formErrors.password ? "error" : ""}`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <div className="form-error">{formErrors.password}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control ${
                  formErrors.confirmPassword ? "error" : ""
                }`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <div className="form-error">{formErrors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
