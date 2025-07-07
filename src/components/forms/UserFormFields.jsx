
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const BasicInfoFields = ({ formData, setFormData }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+254700000000"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          required
        />
      </div>
    </>
  );
};

export const PersonalDetailsFields = ({ formData, setFormData }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Enter your city"
          value={formData.city}
          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
        />
      </div>
    </>
  );
};

export const RoleSpecificFields = ({ role, formData, setFormData }) => {
  switch (role) {
    case 'clergy':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="ordination">Ordination Status</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, ordination: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select ordination status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ordained">Ordained</SelectItem>
                <SelectItem value="licensed">Licensed</SelectItem>
                <SelectItem value="student">Seminary Student</SelectItem>
                <SelectItem value="lay">Lay Leader</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Ministry Specialization</Label>
            <Input
              id="specialization"
              placeholder="e.g., Youth Ministry, Worship, Counseling"
              value={formData.specialization}
              onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
            />
          </div>
        </>
      );

    case 'treasurer':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="experience">Financial Experience (Years)</Label>
            <Input
              id="experience"
              type="number"
              placeholder="Years of financial experience"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualifications">Professional Qualifications</Label>
            <Input
              id="qualifications"
              placeholder="e.g., CPA, ACCA, MBA Finance"
              value={formData.qualifications}
              onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
            />
          </div>
        </>
      );

    case 'secretary':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="experience">Administrative Experience (Years)</Label>
            <Input
              id="experience"
              type="number"
              placeholder="Years of administrative experience"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Key Skills</Label>
            <Input
              id="skills"
              placeholder="e.g., Office Management, Record Keeping, Communication"
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
            />
          </div>
        </>
      );

    case 'system_admin':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="techExperience">Technical Experience (Years)</Label>
            <Input
              id="techExperience"
              type="number"
              placeholder="Years of IT/Systems experience"
              value={formData.techExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, techExperience: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">Technical Certifications</Label>
            <Input
              id="certifications"
              placeholder="e.g., AWS, Azure, CompTIA, Cisco"
              value={formData.certifications}
              onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
            />
          </div>
        </>
      );

    default:
      return null;
  }
};
