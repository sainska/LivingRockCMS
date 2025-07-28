import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Church, 
  Users, 
  Calendar, 
  DollarSign, 
  Shield, 
  Settings, 
  ArrowRight, 
  MapPin,
  Heart,
  BookOpen,
  Headphones,
  Star,
  CheckCircle,
  Globe,
  Mountain
} from "lucide-react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-church-purple to-church-emerald">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-savanna-gold/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-kenya-green/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-church-gold/20 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-kenya-red/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-2 bg-white/90 backdrop-blur-md shadow-md animate-fade-in-up">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 animate-slide-in-left">
            <div className="relative">
              <Church className="h-7 w-7 text-church-purple animate-glow" />
              <Mountain className="h-3 w-3 text-savanna-gold absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-church-purple">Living Rock Church</h1>
              <p className="text-church-purple/80 text-xs flex items-center gap-1">
                <MapPin className="h-2 w-2" />
                Nairobi, Kenya
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 animate-slide-in-right">
            <Badge variant="secondary" className="bg-kenya-green text-white border-none">
              🇰🇪 Proudly Kenyan
            </Badge>
            <Link to="/auth">
              <Button 
                variant="default"
                className="bg-church-purple text-white font-bold border-2 border-church-gold hover:bg-church-gold hover:text-church-purple transition-all duration-300 hover:scale-105 shadow-lg px-6 py-2 text-base"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center text-white">
          <div className="animate-fade-in-up -mt-8" style={{animationDelay: '0.2s'}}>
            <Badge className="mb-6 bg-savanna-gold text-mount-kenya border-none px-4 py-2">
              ✨ Transforming Lives Across Kenya
            </Badge>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in-up leading-tight" style={{animationDelay: '0.4s'}}>
            Church Management<br />
            <span className="bg-gradient-to-r from-savanna-gold via-kenya-gold to-church-gold bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            From the highlands of Mount Kenya to the coastal regions of Mombasa, 
            streamline your church operations with our comprehensive management system. 
            <span className="text-savanna-gold font-semibold">Built for African churches, by African innovators.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-savanna-gold text-mount-kenya hover:bg-kenya-gold transition-all duration-300 hover:scale-105 hover:shadow-2xl px-8 py-4 text-lg font-semibold"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 px-8 py-4 text-lg"
            >
              Watch Demo
              <Headphones className="ml-2 h-6 w-6" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-80 animate-fade-in-up" style={{animationDelay: '1s'}}>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-savanna-gold" />
              <span>500+ Churches Trust Us</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-kenya-green" />
              <span>Available in Swahili & English</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-church-gold" />
              <span>4.9/5 User Rating</span>
            </div>
          </div>
        </div>
        {/* Animated Mouse Scroll Button */}
        <div className="flex justify-center mt-12">
          <a href="https://xiracom.co.ke/" target="_blank" rel="noopener noreferrer" aria-label="Visit Xiracom">
            <svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="animate-bounce">
              <rect x="1" y="1" width="38" height="58" rx="19" stroke="#fff" strokeWidth="2" fill="none"/>
              <rect x="18" y="12" width="4" height="12" rx="2" fill="#fff">
                <animate attributeName="y" values="12;24;12" dur="1.5s" repeatCount="indefinite"/>
              </rect>
            </svg>
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to Manage Your Church
            </h3>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              From Nairobi to Kisumu, from Eldoret to Nakuru - empowering churches across Kenya with modern tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Member Management",
                description: "Keep track of your congregation from Kibera to Karen. Manage contact information, family units, and spiritual journeys with ease.",
                color: "bg-kenya-green/20 border-kenya-green/30",
                delay: "0.2s"
              },
              {
                icon: Calendar,
                title: "Event Planning",
                description: "Organize everything from Sunday services to harambee events. Perfect for coordinating church activities across Nairobi and beyond.",
                color: "bg-church-purple/20 border-church-purple/30",
                delay: "0.4s"
              },
              {
                icon: DollarSign,
                title: "Financial Management",
                description: "Track tithes, offerings, and church projects. Transparent financial records that build trust in your community.",
                color: "bg-savanna-gold/20 border-savanna-gold/30",
                delay: "0.6s"
              },
              {
                icon: Shield,
                title: "Security & Access Control",
                description: "Role-based access ensures sensitive information is protected. From pastors to ushers, everyone has appropriate access.",
                color: "bg-kenya-red/20 border-kenya-red/30",
                delay: "0.8s"
              },
              {
                icon: Settings,
                title: "System Administration",
                description: "Comprehensive admin tools for managing your church systems, backups, and maintaining optimal performance.",
                color: "bg-church-emerald/20 border-church-emerald/30",
                delay: "1s"
              },
              {
                icon: BookOpen,
                title: "Ministry Management",
                description: "Organize youth groups, women's ministry, men's fellowship, and other church ministries effectively.",
                color: "bg-church-gold/20 border-church-gold/30",
                delay: "1.2s"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className={`${feature.color} backdrop-blur-sm text-white border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up group`}
                style={{animationDelay: feature.delay}}
              >
                <CardHeader className="pb-4">
                  <feature.icon className="h-12 w-12 mb-4 text-white group-hover:animate-float" />
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="opacity-90 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kenyan Churches Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h3 className="text-4xl font-bold text-white mb-6">
              Trusted by Churches Across Kenya
            </h3>
            <p className="text-xl text-white/80">
              From Nairobi to Mombasa, churches are embracing digital transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                city: "Nairobi",
                churches: "150+",
                icon: "🏙️",
                delay: "0.2s"
              },
              {
                city: "Mombasa", 
                churches: "85+",
                icon: "🌊",
                delay: "0.4s"
              },
              {
                city: "Kisumu",
                churches: "70+",
                icon: "🌅",
                delay: "0.6s"
              }
            ].map((location, index) => (
              <Card 
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-center transition-all duration-500 hover:scale-105 animate-fade-in-up"
                style={{animationDelay: location.delay}}
              >
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{location.icon}</div>
                  <h4 className="text-2xl font-bold mb-2">{location.city}</h4>
                  <p className="text-3xl font-bold text-savanna-gold mb-2">{location.churches}</p>
                  <p className="text-white/80">Churches Served</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto text-center text-white">
          <div className="animate-fade-in-up">
            <Heart className="h-16 w-16 mx-auto mb-6 text-kenya-red animate-float" />
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Church Management?
            </h3>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Join hundreds of churches across Kenya already using our platform to streamline their operations.
              <br />
              <span className="text-savanna-gold font-semibold">Karibu - You're Welcome!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-savanna-gold text-mount-kenya hover:bg-kenya-gold transition-all duration-300 hover:scale-105 hover:shadow-2xl px-8 py-4 text-lg font-semibold"
                >
                  Anza Sasa - Start Now
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <Church className="h-8 w-8 text-white" />
                <div>
                  <h4 className="text-xl font-bold text-white">Living Rock Church</h4>
                  <p className="text-sm">Management System</p>
                </div>
              </div>
              <p className="leading-relaxed">
                Empowering churches across Kenya with modern management tools. 
                Built with love for the African church community.
              </p>
            </div>
            
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h5 className="text-lg font-semibold text-white mb-4">Contact</h5>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Nairobi, Kenya
                </p>
                <p>Email: info@livingrockchurch.co.ke</p>
                <p>Phone: +254 700 123 456</p>
              </div>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
  <h5 className="text-lg font-semibold text-white mb-4">Languages</h5>
  <div className="flex flex-wrap gap-2">
    <Badge className="bg-green-700 text-white">English</Badge>
    <Badge className="bg-red-700 text-white">Kiswahili</Badge>
    <Badge className="bg-yellow-500 text-black">Kikuyu</Badge>
    <Badge className="bg-blue-700 text-white">Luo</Badge>
    <Badge className="bg-emerald-600 text-white">Luhya</Badge>
    <Badge className="bg-pink-600 text-white">Kamba</Badge>
    <Badge className="bg-purple-700 text-white">Kalenjin</Badge>
    <Badge className="bg-orange-600 text-white">Maasai</Badge>
    <Badge className="bg-teal-700 text-white">Meru</Badge>
    <Badge className="bg-lime-600 text-black">Embu</Badge>
    <Badge className="bg-indigo-700 text-white">Taita</Badge>
    <Badge className="bg-rose-600 text-white">Pokomo</Badge>
    <Badge className="bg-cyan-700 text-white">Samburu</Badge>
    <Badge className="bg-amber-500 text-black">Turkana</Badge>
    <Badge className="bg-sky-700 text-white">Somali</Badge>
    <Badge className="bg-fuchsia-700 text-white">Borana</Badge>
    <Badge className="bg-violet-700 text-white">Rendille</Badge>
    <Badge className="bg-stone-600 text-white">Giriama</Badge>
    <Badge className="bg-yellow-700 text-black">Digo</Badge>
    <Badge className="bg-red-800 text-white">Teso</Badge>
    <Badge className="bg-green-800 text-white">Kuria</Badge>
    <Badge className="bg-orange-700 text-white">Suba</Badge>
    <Badge className="bg-pink-700 text-white">Mijikenda</Badge>
    <Badge className="bg-indigo-800 text-white">Ogiek</Badge>
    <Badge className="bg-amber-600 text-black">Nubi</Badge>
    <Badge className="bg-emerald-700 text-white">Sabaot</Badge>
    <Badge className="bg-lime-700 text-black">Ilchamus</Badge>
    <Badge className="bg-cyan-800 text-white">Dasenach</Badge>
    <Badge className="bg-rose-700 text-white">Gabra</Badge>
  </div>
</div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/60 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <p>© 2025 Living Rock Church Management System. Made with Love in Kenya for churches worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;