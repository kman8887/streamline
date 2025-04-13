import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export function TrackLoading(queueName: string = 'navbar', timeoutMs = 30000) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value,
      token = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = function (...args: any[]) {
      // We expect this instance to have loadingService
      const instance = this as { loadingService: LoadingService };

      if (
        !instance.loadingService ||
        typeof instance.loadingService.setLoading !== 'function'
      ) {
        console.warn(
          `[TrackLoading] Missing or invalid LoadingService on ${propertyKey}`
        );
        return originalMethod.apply(this, args);
      }

      instance.loadingService.setLoading(queueName, token, true);

      const fallback = setTimeout(() => {
        console.warn(
          `[TrackLoading] Timeout hit for "${token}", clearing loader.`
        );
        instance.loadingService.setLoading(queueName, token, false);
      }, timeoutMs);

      const result = originalMethod.apply(this, args);

      if (result?.pipe && typeof result.pipe === 'function') {
        return result.pipe(
          finalize(() => {
            clearTimeout(fallback);
            instance.loadingService.setLoading(queueName, token, false);
          })
        );
      } else {
        clearTimeout(fallback);
        instance.loadingService.setLoading(queueName, token, false);
        return result;
      }
    };

    return descriptor;
  };
}
