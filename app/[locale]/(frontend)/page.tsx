import { Button } from "@/components/ui/button";

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "./_components/page-header";
import { Link } from "@/navigation";

export default function HomePage() {
  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>Build your component library</PageHeaderHeading>
        <PageHeaderDescription>
          Beautifully designed components that you can copy and paste into your
          apps.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </PageActions>
      </PageHeader>
    </div>
  );
}
