import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Download } from "lucide-react";

interface CertificateDialogProps {
  courseTitle: string;
  completedDate: string;
  trigger?: React.ReactNode;
}

export function CertificateDialog({ courseTitle, completedDate, trigger }: CertificateDialogProps) {
  const [name, setName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!certRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Certificate - ${courseTitle}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f0f0f0; }
        @media print { body { background: white; } .cert { box-shadow: none !important; } }
      </style></head><body>
      ${certRef.current.outerHTML}
      <script>setTimeout(() => { window.print(); }, 500);</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  if (!showCertificate) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Award className="h-5 w-5" />
              Get Your Certificate
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Congratulations! 🎉</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You've completed <strong>{courseTitle}</strong>! Enter your full name to generate your certificate of completion.
          </p>
          <div className="space-y-4 mt-2">
            <Input
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base"
              autoFocus
            />
            <Button
              onClick={() => setShowCertificate(true)}
              disabled={!name.trim()}
              className="w-full"
            >
              Generate Certificate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
      <DialogContent className="sm:max-w-3xl p-4">
        <div className="flex justify-end mb-2">
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download / Print
          </Button>
        </div>
        <div
          ref={certRef}
          className="cert"
          style={{
            width: "100%",
            aspectRatio: "1.414",
            background: "linear-gradient(135deg, #0d2137 0%, #1a3a5c 30%, #0d2137 100%)",
            borderRadius: "12px",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Decorative border */}
          <div style={{
            position: "absolute", inset: "12px",
            border: "2px solid rgba(255,255,255,0.15)",
            borderRadius: "8px", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px", pointerEvents: "none",
          }} />

          {/* Accent line */}
          <div style={{
            width: "80px", height: "4px",
            background: "linear-gradient(90deg, #2dd4bf, #14b8a6)",
            borderRadius: "2px", marginBottom: "20px",
          }} />

          <p style={{ fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", opacity: 0.7, marginBottom: "8px" }}>
            Certificate of Completion
          </p>

          <p style={{ fontSize: "14px", opacity: 0.6, marginBottom: "20px" }}>
            This certifies that
          </p>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "32px", fontWeight: 800,
            marginBottom: "8px",
            background: "linear-gradient(135deg, #ffffff, #e0e7ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {name}
          </h2>

          <div style={{
            width: "120px", height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            margin: "12px 0 20px",
          }} />

          <p style={{ fontSize: "14px", opacity: 0.7, marginBottom: "6px" }}>
            has successfully completed the course
          </p>

          <h3 style={{
            fontSize: "22px", fontWeight: 700,
            color: "#2dd4bf", marginBottom: "20px",
          }}>
            {courseTitle}
          </h3>

          <p style={{ fontSize: "12px", opacity: 0.5 }}>
            Issued on {completedDate}
          </p>

          {/* Bottom accent */}
          <div style={{
            position: "absolute", bottom: "30px",
            width: "60px", height: "3px",
            background: "linear-gradient(90deg, #2dd4bf, #14b8a6)",
            borderRadius: "2px",
          }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
