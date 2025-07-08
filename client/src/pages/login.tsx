import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Logo className="w-56 mb-8" />
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button className="w-full">Login</Button>
      </div>
    </div>
  );
}
