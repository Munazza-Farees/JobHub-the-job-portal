import React from "react";
import { useNavigate } from "react-router-dom";

export default function JobHubLanding() {
  const navigate = useNavigate();
  return (
    <div className="bg-white font-sans min-vh-100">
      {/* Hero Section */}
      <section className="bg-light text-center py-5">
        <div className="container">
          <h2 className="display-5 fw-bold text-dark mb-3">
            Find Your Dream Job Today
          </h2>
          <p className="text-muted mb-4 fs-5">
            Connect with top companies hiring now. Discover opportunities that
            match your skills and career goals.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-primary px-4 py-2 fs-5"
              onClick={() => navigate("/register")}
            >
              Create Your Account
            </button>
            <button
              className="btn btn-outline-primary px-4 py-2 fs-5"
              onClick={() => navigate("/jobs-list")}
            >
              Search Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Job Descriptions */}
      <section className="py-5 bg-white">
        <div className="container">
          <h3 className="fs-2 fw-bold text-dark mb-4">Job Descriptions</h3>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {[
              "Frontend Developer",
              "Backend Engineer",
              "UX Designer",
              "DevOps Engineer",
              "Product Manager",
              "Machine Learning Engineer",
            ].map((title) => (
              <div key={title} className="col">
                <a
                  href="#"
                  className="text-decoration-none card h-100 shadow-sm hover-shadow transition"
                >
                  <div className="card-body">
                    <h4 className="card-title fs-4 fw-semibold text-dark mb-3">
                      {title}
                    </h4>
                    <p className="card-text text-muted fs-5">
                      {
                        {
                          "Frontend Developer":
                            "Build modern UIs using React and Tailwind CSS. Work with cross-functional teams to deliver a great user experience.",
                          "Backend Engineer":
                            "Develop scalable backend systems using Node.js and PostgreSQL. Collaborate on API design and data modeling.",
                          "UX Designer":
                            "Design user-centric interfaces and improve product usability through research and testing.",
                          "DevOps Engineer":
                            "Maintain CI/CD pipelines and deploy scalable infrastructure using AWS and containerization tools.",
                          "Product Manager":
                            "Define product strategy and work with tech teams to deliver features that delight users.",
                          "Machine Learning Engineer":
                            "Implement ML models and algorithms for real-world applications. Optimize pipelines for production use.",
                        }[title]
                      }
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-5 bg-light">
        <div className="container">
          <h3 className="fs-2 fw-bold text-dark mb-4">Top Companies</h3>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {[
              {
                name: "Google",
                desc: "Global tech company best specializing in internet-related services and products.",
              },
              {
                name: "Apple",
                desc: "Innovative technology company known for its iPhones, Macs, and software.",
              },
              {
                name: "Microsoft",
                desc: "Leading provider of computer software, consumer electronics, and cloud computing.",
              },
              {
                name: "Amazon",
                desc: "Multinational technology company. Build great e-commerce, cloud computing, and AI tools.",
              },
              {
                name: "Tesla",
                desc: "Electric car and clean energy company delivering sustainable innovations.",
              },
              {
                name: "Meta",
                desc: "Social technology company building products that move the world forward.",
              },
            ].map(({ name, desc }) => (
              <div key={name} className="col">
                <a
                  href="#"
                  className="text-decoration-none card h-100 shadow-sm hover-shadow transition"
                >
                  <div className="card-body">
                    <h4 className="card-title fs-4 fw-semibold text-dark mb-3">
                      {name}
                    </h4>
                    <p className="card-text text-muted fs-5">{desc}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Growth Resources */}
      <section className="py-5 bg-white">
        <div className="container">
          <h3 className="fs-2 fw-bold text-dark mb-4">
            Career Growth Resources
          </h3>
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {[
              "How to Negotiate Your Salary Like a Pro",
              "The Art of Career Networking in a Digital World",
              "Mastering Technical Interviews",
              "From Individual Contributor to Manager",
            ].map((title) => (
              <div key={title} className="col">
                <a
                  href="#"
                  className="text-decoration-none card h-100 shadow-sm hover-shadow transition"
                >
                  <div className="card-body">
                    <h4 className="card-title fs-4 fw-semibold text-dark mb-3">
                      {title}
                    </h4>
                    <p className="card-text text-muted fs-5">
                      {
                        {
                          "How to Negotiate Your Salary Like a Pro":
                            "Learn effective strategies to position your compensation package for growth.",
                          "The Art of Career Networking in a Digital World":
                            "Build a powerful professional network for an awesome new career path.",
                          "Mastering Technical Interviews":
                            "Prepare for coding challenges and deep-dive questions with insider tips.",
                          "From Individual Contributor to Manager":
                            "Navigate the leadership shift with key steps for successful tech management.",
                        }[title]
                      }
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h3 className="fs-3 fw-semibold mb-3">
            Ready to take the next step in your career?
          </h3>
          <p className="mb-4 fs-5">
            Join thousands of professionals who have found their dream jobs
            through our platform.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => console.log("Create Account CTA clicked")}
              className="btn btn-light text-primary px-4 py-2 fs-5 fw-semibold"
            >
              Create Your Account
            </button>
            <button
              onClick={() => console.log("Explore Jobs CTA clicked")}
              className="btn btn-outline-light px-4 py-2 fs-5"
            >
              Explore Jobs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}