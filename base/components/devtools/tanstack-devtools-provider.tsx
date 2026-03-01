import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnyRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export interface TanstackDevtoolsProps {
  show?: boolean;
  router: AnyRouter;
}

const TanstackDevtoolsProvider = ({
  show = false,
  router,
}: TanstackDevtoolsProps) => {
  if (show) {
    return (
      <>
        <ReactQueryDevtools />
        <TanStackRouterDevtools router={router} />
      </>
    );
  }
};

export default TanstackDevtoolsProvider;
