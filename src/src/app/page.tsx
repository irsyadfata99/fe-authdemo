import Link from "next/link";

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Auth Demo</h1>
        <p>
          A complete authentication system built with Spring Boot and Next.js
        </p>

        <div className="features">
          <div className="feature">
            <h3>🔐 Secure Authentication</h3>
            <p>Password hashing with BCrypt</p>
          </div>
          <div className="feature">
            <h3>📱 Modern Frontend</h3>
            <p>Built with Next.js and React</p>
          </div>
          <div className="feature">
            <h3>🚀 Spring Boot API</h3>
            <p>RESTful backend with validation</p>
          </div>
        </div>

        <div className="home-actions">
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
          <Link href="/register" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
