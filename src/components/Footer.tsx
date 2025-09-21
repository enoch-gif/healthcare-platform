import React from 'react';
import { Separator } from './ui/separator';
import { 
  Eye, 
  Shield, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Mail,
  Globe
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-[#0A3D62] to-[#1E5F8B] p-2 rounded-xl">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0A3D62]">Retinal-AI</h3>
                <p className="text-xs text-[#6C757D]">Advanced Eye Care Platform</p>
              </div>
            </div>
            <p className="text-sm text-[#6C757D] mb-4 max-w-md">
              Empowering healthcare professionals and patients with AI-powered retinal analysis 
              and comprehensive eye care management solutions.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-[#6C757D] hover:text-[#0A3D62] transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-[#6C757D] hover:text-[#0A3D62] transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-[#6C757D] hover:text-[#0A3D62] transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-[#6C757D] hover:text-[#0A3D62] transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-medium text-[#0A3D62] mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate?.('features')} className="text-[#6C757D] hover:text-[#0A3D62] transition-colors text-left">Features</button></li>
              <li><button onClick={() => onNavigate?.('about')} className="text-[#6C757D] hover:text-[#0A3D62] transition-colors text-left">About Us</button></li>
              <li><button onClick={() => onNavigate?.('education')} className="text-[#6C757D] hover:text-[#0A3D62] transition-colors text-left">Health Education</button></li>
              <li><button onClick={() => onNavigate?.('contact')} className="text-[#6C757D] hover:text-[#0A3D62] transition-colors text-left">Contact</button></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-medium text-[#0A3D62] mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-[#6C757D] hover:text-[#0A3D62] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-[#6C757D] hover:text-[#0A3D62] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-[#6C757D] hover:text-[#0A3D62] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-[#6C757D] hover:text-[#0A3D62] transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-3 md:mb-0">
            <p className="text-sm text-[#6C757D]">
              © {currentYear} Retinal-AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3 text-[#27AE60]" />
              <span className="text-xs text-[#6C757D]">HIPAA Compliant</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs text-[#6C757D]">
            <span className="flex items-center">
              <span className="mr-1">🏥</span>
              Healthcare Grade
            </span>
            <span className="flex items-center">
              <span className="mr-1">🔒</span>
              Secure
            </span>
            <span className="flex items-center">
              <span className="mr-1">🤖</span>
              AI-Powered
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}