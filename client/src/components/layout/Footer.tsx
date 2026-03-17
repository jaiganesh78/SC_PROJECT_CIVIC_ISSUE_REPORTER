import { Link } from 'react-router-dom';
import { Leaf, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg">CivicReport</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering citizens to report and track civic issues for a cleaner, 
              safer community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/report" className="hover:text-primary">Report an Issue</Link>
              </li>
              <li>
                <Link to="/issues" className="hover:text-primary">View Issues</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-primary">Map View</Link>
              </li>
              <li>
                <Link to="/my-issues" className="hover:text-primary">Track My Issues</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/help" className="hover:text-primary">Help Center</Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-primary">Reporting Guidelines</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-accent"
              >
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-accent"
              >
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="mailto:contact@civicreport.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-accent"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Emergency? Call 911
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CivicReport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
